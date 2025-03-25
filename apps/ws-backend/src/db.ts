import db from "@workspace/db";
import { workspaces } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { debounce } from "./debounce.js";

export const updateContent = async (workspaceId: string, newContent: any) => {
  try {
    await db
      .update(workspaces)
      .set({
        content: newContent,
      })
      .where(eq(workspaces.id, workspaceId));
  } catch {
    console.log("Could not update workspace");
  }
};

export const debounceUpdateContent = debounce(updateContent, 10000);
