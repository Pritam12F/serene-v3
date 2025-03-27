import { Liveblocks } from "@liveblocks/node";
import { createClient } from "@liveblocks/client";

export const liveblocks = new Liveblocks({
  secret: process.env.NEXT_PUBLIC_LIVEBLOCK_SECRET ?? "",
});

export const client = createClient({ authEndpoint: "/api/liveblocks-auth" });
