"use server";

import { getServerSession } from "next-auth";
import { ActionResponse } from "../types";
import db from "@workspace/db";
import { eq } from "drizzle-orm";
import { coverImages, posts, users } from "@workspace/db/schema";
import { authOptions } from "@/lib/auth";

export const addOrUpdateCoverImage = async (
  coverUrl: string,
  postId: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    console.log("No user session found.");
    throw new Error("You must be signed in to change cover image");
  }

  try {
    console.log("Fetching user:", session.user.id);
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        posts: true,
      },
    });

    console.log("Fetched user:", fetchedUser);

    const hasAccessToPost = fetchedUser?.posts.find((x) => x.id === postId);

    if (!hasAccessToPost) {
      console.log("User has no access to this post.");
      return {
        success: false,
        message: "User doesn't have access to this post",
        data: null,
      };
    }

    console.log("User has access. Inserting/updating cover image.");
    const insertedCoverImage = await db
      .insert(coverImages)
      .values({ url: coverUrl, postId })
      .onConflictDoUpdate({
        target: coverImages.postId,
        set: { url: coverUrl },
      })
      .returning({ id: coverImages.id });

    console.log("Inserted cover image:", insertedCoverImage);

    await db
      .update(posts)
      .set({
        coverImageId: insertedCoverImage[0]?.id,
      })
      .where(eq(posts.id, postId));
    console.log("Updated post with new cover image.");
    return {
      success: true,
      message: "Successfully added cover image",
      data: null,
    };
  } catch (err) {
    console.error("Error in addOrUpdateCoverImage:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something happened trying to add cover image";

    return { success: false, message: errorMessage, data: null };
  }
};

export const addOrUpdatePostEmoji = async (
  postId: string,
  emoji: string
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to change cover image");
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
  postId: string,
  newContent: unknown
): Promise<ActionResponse<null>> => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("You must be signed in to change post content");
  }

  try {
    if (!newContent) {
      return { success: false, message: "No data provided", data: null };
    }

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
