import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
  secret: process.env.NEXT_PUBLIC_LIVEBLOCK_SECRET ?? "",
});
