"use server";

import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import { posts, users } from "@workspace/db/schema";
import { asc, eq } from "drizzle-orm";
import db from "@workspace/db";
import { SelectManyPostType, SelectPostType } from "@workspace/common/types/db";

export const changePostNameById = async (
  postId: number,
  newName: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed in to change the name of a post");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
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
): Promise<ActionResponse<null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed delete a post");
  }
  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
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

export const fetchAllPostsByUserId = async (
  user_id: string
): Promise<ActionResponse<SelectManyPostType | null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const postsFetched = await db.query.posts.findMany({
      where: eq(posts.userId, user_id),
      orderBy: [asc(posts.createdAt)],
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
): Promise<ActionResponse<SelectPostType | null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
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
      with: { coverImage: true },
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

export const createNewPost = async (
  title: string,
  content: any,
  parentId?: number | null
): Promise<ActionResponse<number | null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed in to create a new post");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!fetchedUser) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    const newPost = await db
      .insert(posts)
      .values({
        name: title,
        content,
        userId: fetchedUser.id,
        parentId,
      })
      .returning({ id: posts.id });

    return {
      success: true,
      message: "Post created successfully",
      data: newPost[0]?.id || null,
    };
  } catch (err) {
    console.log(err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to create a new post";

    return { success: false, message: errorMessage, data: null };
  }
};
