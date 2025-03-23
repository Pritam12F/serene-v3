import { InsertUserSchema } from "@workspace/common/types/db";
import db from "@workspace/db";
import { users } from "@workspace/db/schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { createInitialPosts } from "@workspace/db/seed";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = InsertUserSchema.safeParse(body);

  if (error || !data.hashedPassword) {
    return NextResponse.json(
      {
        message: "Invalid inputs",
      },
      { status: 403 }
    );
  }

  const userExists = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (userExists) {
    return NextResponse.json(
      {
        message: "User already exists!",
        accountType: userExists.accountType,
      },
      { status: 409 }
    );
  }

  data.hashedPassword = await bcrypt.hash(data.hashedPassword, 10);

  try {
    const userId = await db
      .insert(users)
      .values(data)
      .returning({ userId: users.id });

    await createInitialPosts(userId[0]!.userId);

    return NextResponse.json({
      message: "User signed up successfully",
    });
  } catch (e) {
    const error =
      e instanceof Error ? e.message : "Error occured signing up user";

    return NextResponse.json(
      {
        error,
      },
      { status: 403 }
    );
  }
}
