import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import {
  InsertWorkspaceType,
  SelectWorkspaceByUserId,
} from "@workspace/common/types/db";
import db from "@workspace/db";
import { users, workspaces } from "@workspace/db/schema";
import { fetchUserByEmail } from "../user";
import { eq } from "drizzle-orm";

export const createWorkspace = async (
  name: string
): Promise<ActionResponse<InsertWorkspaceType | null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("User is not authorized");
  }

  try {
    const randomNumber = String(Math.floor(Math.random() * 100000) + 1);
    const userId = (await fetchUserByEmail()).data?.id;
    const res = await db
      .insert(workspaces)
      .values({
        name,
        ownerId: userId!,
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

export const fetchAllUserWorkspaces = async (
  user_id?: string
): Promise<ActionResponse<SelectWorkspaceByUserId | null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("User is not authorized");
  }
  try {
    const userId = user_id ?? (await fetchUserByEmail()).data?.id;
    const allWorkspaces = await db.query.users.findFirst({
      where: eq(users.id, userId!),
      with: {
        mainWorkspaces: {},
        secondaryWorkspaces: {},
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
