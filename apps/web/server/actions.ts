"use server";

import {
  SelectManyPostType,
  SelectPostType,
  SelectUserType,
} from "@workspace/common/types/db";
import db from "@workspace/db";
import { coverImages, posts, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

type ActionResponse<T = null> = {
  success: boolean;
  message: string;
  data: T;
};

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

export const fetchUserByEmail = async (): Promise<
  ActionResponse<SelectUserType | null>
> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
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
): Promise<ActionResponse<SelectManyPostType | null>> => {
  const session = await getServerSession();

  if (!session?.user) {
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

export const addOrUpdateCoverImage = async (
  coverUrl: string,
  postId: number
): Promise<ActionResponse<null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed in to change cover image");
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

    const insertedCoverImage = await db
      .insert(coverImages)
      .values({ url: coverUrl, postId })
      .onConflictDoUpdate({
        target: coverImages.postId,
        set: { url: coverUrl },
      })
      .returning({ id: coverImages.id });

    await db
      .update(posts)
      .set({
        coverImageId: insertedCoverImage[0]?.id,
      })
      .where(eq(posts.id, postId));

    return {
      success: true,
      message: "Successfully added cover image",
      data: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to add cover image";

    return { success: false, message: errorMessage, data: null };
  }
};

export const addOrUpdatePostEmoji = async (
  postId: number,
  emoji: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("You must be signed in to change cover image");
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

    await db
      .update(posts)
      .set({
        emoji,
      })
      .where(eq(posts.id, postId));

    return { success: true, message: "Emoji updated successfully", data: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to add cover image";

    return { success: false, message: errorMessage, data: null };
  }
};

export const addOrUpdatePostContent = async (
  postId: number,
  newContent: unknown
): Promise<ActionResponse<null>> => {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("You must be signed in to change post content");
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

    const res = await db
      .update(posts)
      .set({
        content: newContent,
      })
      .where(eq(posts.id, postId));

    return {
      success: true,
      message: "Post content updated",
      data: null,
    };
  } catch (err) {
    console.log(err);

    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to upload content";

    return { success: false, message: errorMessage, data: null };
  }
};
