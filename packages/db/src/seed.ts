import db from ".";
import { posts } from "./schema";

export async function seedInitialData(userId: string) {
  await db.insert(posts).values({
    userId,
    name: "Getting started",
  });

  await db.insert(posts).values({
    userId,
    name: "Quick Note",
  });

  await db.insert(posts).values({
    userId,
    name: "Personal Home",
  });

  await db.insert(posts).values({
    userId,
    name: "Task List",
  });

  await db.insert(posts).values({
    userId,
    name: "Journal",
  });

  await db.insert(posts).values({
    userId,
    name: "Reading List",
  });
}
