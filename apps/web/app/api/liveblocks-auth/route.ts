import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/random-color";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST() {
  const sessionData = await getServerSession();

  if (!sessionData?.user) {
    NextResponse.json(
      {
        message: "Not authorized",
      },
      { status: 401 }
    );

    redirect("/sign-in");
  }

  const { id, name, email, image } = sessionData.user;

  const user = {
    id,
    info: {
      id,
      name: name ?? "Anonymous",
      email,
      image: image ?? "",
      color: getUserColor(id)!,
    },
  };

  const { body, status } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    {
      userInfo: user.info,
    }
  );

  return new Response(body, { status });
}
