import { Liveblocks } from "@liveblocks/node";
import { createClient } from "@liveblocks/client";

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET ?? "",
});

export const client = createClient({ authEndpoint: "/api/liveblocks-auth" });
