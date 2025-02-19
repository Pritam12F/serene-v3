"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@workspace/db";
import { posts, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export const changePostNameById = async (postId: number, newName: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to change the name of a post");
  }

  try {
    await db.update(posts).set({ name: newName }).where(eq(posts.id, postId));

    return {
      success: true,
      message: "Post title successfully changed",
      data: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to rename post";
    return { success: false, message: errorMessage, data: null };
  }
};

export const deletePostById = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed delete a post");
  }
  try {
    await db.delete(posts).where(eq(posts.id, postId));

    return { success: true, message: "Post deleted successfully", data: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to delete post";

    return { success: false, message: errorMessage, data: null };
  }
};

export const fetchUserByClerkId = async (clerkId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    return {
      success: true,
      message: "Successfully fetched user details!",
      data: userFetched,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to fetch user";

    return { success: false, message: errorMessage, data: null };
  }
};

export const fetchAllPostsByUserId = async (user_id: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const postsFetched = await db.query.posts.findMany({
      where: eq(posts.userId, user_id),
    });

    return {
      success: true,
      message: "Successfully fetched all posts!",
      data: postsFetched,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to fetch posts";
    return { success: false, message: errorMessage, data: null };
  }
};

export const fetchSinglePostById = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const fetchedPost = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    return {
      success: true,
      message: "Post fetched successfully",
      data: fetchedPost,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to fetch post";

    return { success: false, message: errorMessage, data: null };
  }
};
