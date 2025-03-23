"use server";

import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import {
  InsertWorkspaceType,
  SelectWorkspaceByUserId,
} from "@workspace/common/types/db";
import db from "@workspace/db";
import {
  secdondaryWorkspacesOnUsers,
  users,
  workspaces,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";

export const createWorkspace = async (
  name: string
): Promise<ActionResponse<InsertWorkspaceType | null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("User is not authorized");
  }

  try {
    const randomNumber = String(Math.floor(Math.random() * 100000) + 1);
    const userId = session.user.id;
    const res = await db
      .insert(workspaces)
      .values({
        name,
        ownerId: userId,
        inviteId: randomNumber,
      })
      .returning({
        id: workspaces.id,
        name: workspaces.name,
        ownerId: workspaces.ownerId,
        inviteId: workspaces.inviteId,
      })
      .onConflictDoNothing();

    return {
      success: true,
      message: "Workspace added successfully",
      data: res[0]!,
    };
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
    const allWorkspaces = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        mainWorkspaces: true,
        secondaryWorkspaces: true,
      },
      columns: {
        id: false,
        name: false,
        email: false,
        profilePic: false,
        phone: false,
        accountType: false,
        hashedPassword: false,
        updatedAt: false,
        createdAt: false,
      },
    });

    return {
      success: true,
      message: "All workspaces fetched!",
      data: allWorkspaces,
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
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("User is not authorized");
  }

  try {
    const fetchedWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.inviteId, inviteId),
    });

    if (!fetchedWorkspace) {
      return {
        success: false,
        message: "This workspace doesn't exits",
        data: null,
      };
    }
    const userId = session.user.id;
    if (fetchedWorkspace.ownerId === userId) {
      return {
        success: false,
        message: "You are the owner of this workspace, can't join as member",
        data: null,
      };
    }

    await db
      .insert(secdondaryWorkspacesOnUsers)
      .values({ userId: userId, workspaceId: fetchedWorkspace.id });

    return {
      success: true,
      message: "Added user as member to workspace",
      data: null,
    };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Something happened trying to fetch user";

    return { success: false, message: errorMessage, data: null };
  }
};
