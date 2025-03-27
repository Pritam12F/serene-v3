"use client";

import { Dispatch, SetStateAction } from "react";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import dynamic from "next/dynamic";

export function CollaborativeRoom({
  isReady,
  onReadyAction,
  roomId,
}: {
  isReady: boolean;
  onReadyAction: Dispatch<SetStateAction<boolean>>;
  roomId: string;
}) {
  const Editor = dynamic(() => import("./workspace-editor"), {
    ssr: false,
  });
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <Editor editable={true} isReady={isReady} onReady={onReadyAction} />
      </ClientSideSuspense>
    </RoomProvider>
  );
}
