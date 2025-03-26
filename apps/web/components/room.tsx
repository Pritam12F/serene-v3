"use client";

import { Dispatch, SetStateAction } from "react";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import dynamic from "next/dynamic";

export function CollaborativeRoom({
  isReady,
  onReadyAction,
}: {
  isReady: boolean;
  onReadyAction: Dispatch<SetStateAction<boolean>>;
}) {
  const Editor = dynamic(() => import("./workspace-editor"), {
    ssr: false,
  });
  return (
    <RoomProvider id="my-room">
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <Editor editable={true} isReady={isReady} onReady={onReadyAction} />
      </ClientSideSuspense>
    </RoomProvider>
  );
}
