import { UpdatePasswordSchema } from "@workspace/common/types/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@workspace/db";
import { eq } from "drizzle-orm";
import { users } from "@workspace/db/schema";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You are not authorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { data, success } = UpdatePasswordSchema.safeParse(body);

  if (!success) {
    return NextResponse.json({ message: "Invalid inputs" }, { status: 422 });
  }

  try {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (
      fetchedUser?.accountType === "google" ||
      fetchedUser?.accountType === "github"
    ) {
      return NextResponse.json(
        { message: `User is registered with ${fetchedUser.accountType}` },
        { status: 403 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.currentPassword,
      fetchedUser?.hashedPassword!
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          message: "Wrong password provided",
        },
        { status: 402 }
      );
    }
    const newHashedPassword = await bcrypt.hash(data.newPassword, 10);

    await db.update(users).set({
      hashedPassword: newHashedPassword,
    });

    return NextResponse.json({ message: "Password updated!" });
  } catch (e) {
    const error =
      e instanceof Error ? e.message : "Error occured signing up user";

    return NextResponse.json(
      {
        error,
      },
      { status: 405 }
    );
  }
}
