import { authOptions } from "@/lib/auth";
import { UpdateUserSchema } from "@workspace/common/types/forms";
import db from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "You are not authorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { data, success } = UpdateUserSchema.safeParse(body);

  if (!success) {
    return NextResponse.json({ message: "Invalid inputs" }, { status: 422 });
  }

  try {
    await db
      .update(users)
      .set({
        phone: data.phone,
        name: data.name,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Profile updated!" });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Some error occured";

    return NextResponse.json(
      {
        message: error,
      },
      { status: 400 }
    );
  }
}
