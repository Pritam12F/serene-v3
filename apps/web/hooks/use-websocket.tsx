import { useEffect, useState } from "react";

enum MessageType {
  UPDATE_COVER = "UPDATE_COVER",
  UPDATE_NAME = "UPDATE_NAME",
  UPDATE_EMOJI = "UPDATE_EMOJI",
  JOIN_WORKSPACE = "JOIN",
  LEAVE_WORKSPACE = "LEAVE",
}

export const useWebsocket = (
  workspaceId: string,
  wsUrl = "ws://localhost:8080"
) => {
  const [ws, setWs] = useState<WebSocket>();
  const [isReady, setIsReady] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState<any>();
  const [coverImage, setCoverImage] = useState("");
  const [emoji, setEmoji] = useState("");

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
      } else if (data.type === MessageType.UPDATE_EMOJI) {
      } else if (data.type === MessageType.UPDATE_NAME) {
      }
    };

    return () => websocket?.close();
  }, [workspaceId]);

  return { ws, content, isReady };
};
