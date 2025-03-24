"use server";

import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import {
  InsertWorkspaceType,
  SelectWorkspaceByUserId,
} from "@workspace/common/types/db";
import db from "@workspace/db";
import { secondaryWorkspacesUsers, workspaces } from "@workspace/db/schema";
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

    const secondaryWorkspaceId = await db
      .insert(secondaryWorkspacesUsers)
      .values({ userId: userId, workspaceId: fetchedWorkspace.id })
      .returning({ id: secondaryWorkspacesUsers.workspaceId });

    return {
      success: true,
      message: "Added user as member to workspace",
      data: secondaryWorkspaceId[0]?.id,
    };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Something happened trying to fetch user";

    return { success: false, message: errorMessage, data: null };
  }
};
