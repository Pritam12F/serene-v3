// import { Liveblocks } from "@liveblocks/node";
// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";

// const liveblocks = new Liveblocks({
//   secret: process.env.NEXT_PUBLIC_LIVEBLOCK_SECRET ?? "",
// });

// export async function POST() {
//   const sessionData = await getServerSession();

//   if (!sessionData?.user) {
//     return NextResponse.json(
//       {
//         message: "Not authorized",
//       },
//       { status: 401 }
//     );
//   }

//   const user = sessionData.user;

//   // Start an auth session inside your endpoint
//   const session = liveblocks.prepareSession(user.id);

//   // Use a naming pattern to allow access to rooms with wildcards
//   // Giving the user read access on their org, and write access on their group
//   session.allow(`${user.organization}:*`, session.READ_ACCESS);
//   session.allow(`${user.organization}:${user.group}:*`, session.FULL_ACCESS);

//   // Authorize the user and return the result
//   const { status, body } = await session.authorize();
//   return new Response(body, { status });
// }
