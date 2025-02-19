"use server";

import db from "@workspace/db";
import { posts } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export const changePostName = async (postId: number, newName: string) => {
  try {
    await db.update(posts).set({ name: newName }).where(eq(posts.id, postId));
  } catch (err) {
    throw err;
  }
};
