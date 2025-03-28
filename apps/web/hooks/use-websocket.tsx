import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MessageType } from "@workspace/common/types/ws";

export const useWebsocket = (
  workspaceId: string,
  StateActions: {
    setCoverLink: Dispatch<SetStateAction<string | null>>;
    setEmoji: Dispatch<SetStateAction<string | null | undefined>>;
    setName: Dispatch<SetStateAction<string>>;
  },
  wsUrl = "ws://localhost:8080"
) => {
  const [ws, setWs] = useState<WebSocket>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ws.backend");
    const websocket = new WebSocket(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}?token=${token}`
    );

    setWs(websocket);

    websocket.onopen = () => {
      setIsReady(true);
      websocket.send(
        JSON.stringify({
          type: MessageType.JOIN_WORKSPACE,
          payload: {
            workspaceId,
          },
        })
      );
    };
    websocket.onclose = () => {
      setIsReady(false);
      websocket.send(
        JSON.stringify({
          type: MessageType.LEAVE_WORKSPACE,
          payload: {
            workspaceId,
          },
        })
      );
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === MessageType.UPDATE_COVER) {
        StateActions.setCoverLink(data.payload.coverLink);
      } else if (data.type === MessageType.UPDATE_EMOJI) {
        StateActions.setEmoji(data.payload.emoji);
      } else if (data.type === MessageType.UPDATE_NAME) {
        StateActions.setName(data.payload.name);
      }
    };

    return () => websocket?.close();
  }, [workspaceId]);

  return { ws, isReady };
};
