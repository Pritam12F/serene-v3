"use server";

import { auth } from "@clerk/nextjs/server";
import {
  SelectImageType,
  SelectManyImageType,
  SelectManyPostType,
  SelectManyUserType,
  SelectPostType,
  SelectUserType,
} from "@workspace/common/types/db";
import db from "@workspace/db";
import { posts, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

interface ActionReturnType {
  success: boolean;
  message: string;
  data:
    | SelectUserType
    | SelectManyUserType
    | SelectImageType
    | SelectManyImageType
    | SelectPostType
    | SelectManyPostType
    | null;
}

export const changePostNameById = async (
  postId: number,
  newName: string
): Promise<ActionReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to change the name of a post");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: {
        posts: true,
      },
    });

    const hasAccessToPost = fetchedUser?.posts.find((x) => x.id === postId);

    if (!hasAccessToPost) {
      return {
        success: false,
        message: "User doesn't have access to this post",
        data: null,
      };
    }

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

export const deletePostById = async (
  postId: number
): Promise<ActionReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed delete a post");
  }
  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: {
        posts: true,
      },
    });

    const hasAccessToPost = fetchedUser?.posts.find((x) => x.id === postId);

    if (!hasAccessToPost) {
      return {
        success: false,
        message: "User doesn't have access to this post",
        data: null,
      };
    }

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

export const fetchUserByClerkId = async (
  clerkId: string
): Promise<ActionReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
      with: { posts: true },
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

export const fetchAllPostsByUserId = async (
  user_id: string
): Promise<ActionReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const postsFetched = await db.query.posts.findMany({
      where: eq(posts.userId, user_id),
      with: { user: true, images: true, parent: true, children: true },
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

export const fetchSinglePostById = async (
  postId: number
): Promise<ActionReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: {
        posts: true,
      },
    });

    const hasAccessToPost = fetchedUser?.posts.find((x) => x.id === postId);

    if (!hasAccessToPost) {
      return {
        success: false,
        message: "User doesn't have access to this post",
        data: null,
      };
    }

    const fetchedPost = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: { user: true, images: true, parent: true, children: true },
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
