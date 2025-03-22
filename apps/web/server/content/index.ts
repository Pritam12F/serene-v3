"use server";

import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import db from "@workspace/db";
import { eq } from "drizzle-orm";
import { coverImages, posts, users } from "@workspace/db/schema";

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

export const updatePostContent = async (
  postId: number,
  newContent: unknown
): Promise<ActionResponse<null>> => {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("You must be signed in to change post content");
  }

  try {
    if (!newContent) {
      return { success: false, message: "No data provided", data: null };
    }

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
