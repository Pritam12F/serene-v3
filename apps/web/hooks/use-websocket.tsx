import { useEffect, useState } from "react";

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
          type: "join",
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
          type: "leave",
          payload: {
            workspaceId,
          },
        })
      );
    };
    websocket.onmessage = (event) => {
      if (event.data.payload === "uploadContent") {
        setContent(event.data);
      }
    };
  }, [workspaceId]);

  return { ws, content, isReady };
};
