"use server";

import { SelectUserType } from "@workspace/common/types/db";
import { ActionResponse } from "../types";
import { getServerSession } from "next-auth";
import db from "@workspace/db";
import { eq } from "drizzle-orm";
import { users } from "@workspace/db/schema";
import { authOptions } from "@/lib/auth";

export const fetchUserByEmail = async (): Promise<
  ActionResponse<SelectUserType | null>
> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be signed in to fetch users from the db");
  }

  try {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
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
