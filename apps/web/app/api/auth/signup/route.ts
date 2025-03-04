import { InsertUserSchema } from "@workspace/common/types/db";
import db from "@workspace/db";
import { users } from "@workspace/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = InsertUserSchema.safeParse(body);

  if (error) {
    return NextResponse.json(
      {
        message: "Invalid inputs",
      },
      { status: 403 }
    );
  }

  try {
    await db.insert(users).values(data);

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
