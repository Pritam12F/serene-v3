"use server";

import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import { posts, users } from "@workspace/db/schema";
import { and, asc, eq } from "drizzle-orm";
import db from "@workspace/db";
import { SelectManyPostType, SelectPostType } from "@workspace/common/types/db";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const changePostNameById = async (
  postId: string,
  newName: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to change the name of a post");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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
  postId: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed delete a post");
  }
  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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

    revalidatePath("/");

    return { success: true, message: "Post deleted successfully", data: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to delete post";

    return { success: false, message: errorMessage, data: null };
  }
};

export const fetchAllPostsByUserId = async (): Promise<
  ActionResponse<SelectManyPostType | null>
> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const postsFetched = await db.query.posts.findMany({
      where: eq(posts.userId, session.user.id),
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
  postId: string
): Promise<ActionResponse<SelectPostType | null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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
  parentId?: string | null
): Promise<ActionResponse<string | null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to create a new post");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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
        userId: session.user.id,
        parentId: parentId || null,
      })
      .returning({ id: posts.id });

    revalidatePath("/");

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

export const addToFavorite = async (
  postId: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to add favorites");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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

    await db
      .update(posts)
      .set({ isFavorite: true })
      .where(eq(posts.id, postId));

    return {
      success: true,
      message: "Post added to favorites",
      data: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to add post to favorites";

    return { success: false, message: errorMessage, data: null };
  }
};

export const removeFromFavorite = async (
  postId: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to remove favorites");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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

    await db
      .update(posts)
      .set({ isFavorite: false })
      .where(eq(posts.id, postId));

    return {
      success: true,
      message: "Post removed from favorites",
      data: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to remove post from favorites";

    return { success: false, message: errorMessage, data: null };
  }
};

export const fetchAllFavoritePostsByUserId = async (
  postId?: string
): Promise<ActionResponse<SelectPostType | null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  if (!postId) {
    throw new Error("No post ID provided!");
  }

  try {
    const postsFetched = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.isPublic, true)),
      orderBy: [asc(posts.createdAt)],
    });

    return {
      success: true,
      message: "Successfully fetched all favorite posts!",
      data: postsFetched,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to fetch favorite posts";
    return { success: false, message: errorMessage, data: null };
  }
};

export const makePostPublic = async (
  postId: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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

    await db.update(posts).set({ isPublic: true }).where(eq(posts.id, postId));
    revalidatePath("/");

    return {
      success: true,
      message: "Post made public successfully",
      data: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to make post public";
    return { success: false, message: errorMessage, data: null };
  }
};

export const makePostPrivate = async (
  postId: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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

    await db.update(posts).set({ isPublic: false }).where(eq(posts.id, postId));
    revalidatePath("/");

    return {
      success: true,
      message: "Post made private successfully",
      data: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to make post private";
    return { success: false, message: errorMessage, data: null };
  }
};
