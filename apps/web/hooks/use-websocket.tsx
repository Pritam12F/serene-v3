import { useEffect, useState } from "react";

export const useWebsocket = (
  dependencies: any[],
  wsUrl = "ws://localhost:8080"
) => {
  const [ws, setWs] = useState<WebSocket>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(wsUrl, localStorage.getItem("ws.backend")!);

    setWs(websocket);

    websocket.onopen = () => setIsReady(true);
    websocket.onclose = () => setIsReady(false);
    websocket.onmessage = (event) => {
      ws?.send(event.data);
    };
    websocket.onclose = () => {
      ws?.close();
    };
  }, [...dependencies]);

  return { ws, isReady };
};
