"use server";

import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import {
  InsertWorkspaceType,
  SelectWorkspaceByUserId,
  SelectWorkspaceType,
} from "@workspace/common/types/db";
import db from "@workspace/db";
import {
  secondaryWorkspacesUsers,
  users,
  workspaceCoverImages,
  workspaces,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { liveblocks } from "@/lib/liveblocks";
import { v4 as uuid } from "uuid";
import { RoomAccesses } from "@liveblocks/node";
import { revalidatePath } from "next/cache";

export const createWorkspace = async (
  name: string
): Promise<ActionResponse<InsertWorkspaceType | null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("User is not authorized");
  }

  const { id, email } = session.user;
  try {
    const roomId = uuid();
    const metadata = {
      creatorId: session.user.id,
      email,
      title: name,
    };
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };
    await liveblocks.createRoom(roomId, {
      metadata,
      defaultAccesses: [],
      usersAccesses,
    });

    revalidatePath("/");
    const randomNumber = String(Math.floor(Math.random() * 100000) + 1);
    const res = await db
      .insert(workspaces)
      .values({
        id: roomId,
        name,
        ownerId: id,
        inviteId: randomNumber,
      })
      .returning({
        id: workspaces.id,
        name: workspaces.name,
        ownerId: workspaces.ownerId,
        inviteId: workspaces.inviteId,
      })
      .onConflictDoNothing();

    return { success: true, message: "Room created", data: res?.[0] };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Something happened trying to fetch user";

    return { success: false, message: errorMessage, data: null };
  }
};

export const fetchAllUserWorkspaces = async (): Promise<
  ActionResponse<SelectWorkspaceByUserId | null>
> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("User is not authorized");
  }
  try {
    const userId = session.user.id;
    const mainWorkspaces = await db.query.workspaces.findMany({
      where: eq(workspaces.ownerId, userId),
    });

    const secondaryWorkspaces =
      await db.query.secondaryWorkspacesUsers.findMany({
        where: eq(secondaryWorkspacesUsers.userId, session.user.id),
        with: {
          workspace: true,
        },
        columns: {
          userId: false,
          workspaceId: false,
        },
      });

    return {
      success: true,
      message: "All workspaces fetched!",
      data: {
        mainWorkspaces,
        secondaryWorkspaces: secondaryWorkspaces.map((x) => x.workspace),
      },
    };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Something happened trying to fetch user";

    return { success: false, message: errorMessage, data: null };
  }
};

export const joinWorkspaceById = async (
  inviteId: string
): Promise<ActionResponse<string | null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("User is not authorized");
  }

  try {
    const fetchedWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.inviteId, inviteId),
      columns: {
        name: false,
        emoji: false,
        createdAt: false,
        updatedAt: false,
        coverImageId: false,
        inviteId: false,
        ownerId: false,
      },
    });

    if (!fetchedWorkspace) {
      return { success: false, message: "No such workspace", data: null };
    }
    const currentUsers = await liveblocks.getRoom(fetchedWorkspace?.id);
    const updatedUsers = liveblocks.updateRoom(fetchedWorkspace.id, {
      defaultAccesses: [],
      groupsAccesses: {},
      usersAccesses: {
        ...currentUsers.usersAccesses,
        [session.user.email]: ["room:write"],
      },
    });

    await db.insert(secondaryWorkspacesUsers).values({
      userId: session.user.id,
      workspaceId: fetchedWorkspace.id,
    });

    return {
      success: true,
      message: "Joined room",
      data: fetchedWorkspace.id,
    };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Something happened trying to fetch user";

    return { success: false, message: errorMessage, data: null };
  }
};

export const fetchSingleWorkspace = async (
  id: string
): Promise<ActionResponse<SelectWorkspaceType | null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("User is not authorized");
  }

  try {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        hashedPassword: false,
      },
      with: {
        mainWorkspaces: {
          with: {
            coverImage: true,
          },
        },
        secondaryWorkspaces: {
          with: {
            workspace: {
              with: {
                coverImage: true,
              },
            },
          },
        },
      },
    });

    const isInMainWorkspaces = userFetched?.mainWorkspaces.find(
      (x) => x.id === id
    );

    const isInSecondaryWorkspaces = userFetched?.secondaryWorkspaces.find(
      (x) => x.workspaceId === id
    );

    if (!isInMainWorkspaces && !isInSecondaryWorkspaces) {
      return {
        success: false,
        message: "User has not joined this workspace",
        data: null,
      };
    }

    return {
      success: true,
      message: "Workspace fetched",
      data: isInMainWorkspaces
        ? isInMainWorkspaces
        : isInSecondaryWorkspaces?.workspace,
    };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Something happened trying to fetch user";

    return { success: false, message: errorMessage, data: null };
  }
};

export const addOrUpdateWorkspaceCoverImage = async (
  coverUrl: string,
  workspaceId: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to change cover image");
  }

  try {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        hashedPassword: false,
      },
      with: {
        mainWorkspaces: true,
        secondaryWorkspaces: {
          with: {
            workspace: {
              with: {
                coverImage: true,
              },
            },
          },
        },
      },
    });

    const isInMainWorkspaces = userFetched?.mainWorkspaces.find(
      (x) => x.id === workspaceId
    );

    const isInSecondaryWorkspaces = userFetched?.secondaryWorkspaces.find(
      (x) => x.workspaceId === workspaceId
    );

    if (!isInMainWorkspaces && !isInSecondaryWorkspaces) {
      return {
        success: false,
        message: "User has not joined this workspace",
        data: null,
      };
    }

    const insertedCoverImage = await db
      .insert(workspaceCoverImages)
      .values({ url: coverUrl, workspaceId })
      .onConflictDoUpdate({
        target: workspaceCoverImages.workspaceId,
        set: { url: coverUrl },
      })
      .returning({ id: workspaceCoverImages.id });

    await db
      .update(workspaces)
      .set({
        coverImageId: insertedCoverImage[0]?.id,
      })
      .where(eq(workspaces.id, workspaceId));

    return {
      success: true,
      message: "Successfully added cover image",
      data: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to add cover image";

    return { success: false, message: errorMessage, data: null };
  }
};

export const addOrUpdateWorkspaceEmoji = async (
  workspaceId: string,
  emoji: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to change cover image");
  }

  try {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        hashedPassword: false,
      },
      with: {
        mainWorkspaces: true,
        secondaryWorkspaces: {
          with: {
            workspace: true,
          },
        },
      },
    });

    const isInMainWorkspaces = userFetched?.mainWorkspaces.find(
      (x) => x.id === workspaceId
    );

    const isInSecondaryWorkspaces = userFetched?.secondaryWorkspaces.find(
      (x) => x.workspaceId === workspaceId
    );

    if (!isInMainWorkspaces && !isInSecondaryWorkspaces) {
      return {
        success: false,
        message: "User has not joined this workspace",
        data: null,
      };
    }

    await db
      .update(workspaces)
      .set({
        emoji,
      })
      .where(eq(workspaces.id, workspaceId));

    return { success: true, message: "Emoji updated successfully", data: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to add cover image";

    return { success: false, message: errorMessage, data: null };
  }
};
