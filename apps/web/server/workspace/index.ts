import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import { InsertWorkspaceType } from "@workspace/common/types/db";
import db from "@workspace/db";
import { workspaces } from "@workspace/db/schema";

export const createWorkspace = async (
  name: string
): Promise<ActionResponse<InsertWorkspaceType | null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("User is not authorized");
  }

  try {
    const randomNumber = String(Math.floor(Math.random() * 100000) + 1);
    const res = await db
      .insert(workspaces)
      .values({
        name,
        ownerId: session.user.id,
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
