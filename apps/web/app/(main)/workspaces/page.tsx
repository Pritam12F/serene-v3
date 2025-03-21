"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getJWT } from "@/server/auth";

export default function Workspaces() {
  const [ws, setWs] = useState<WebSocket>();
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const setJwt = async () => {
      if (
        localStorage.getItem("ws.backend") &&
        localStorage.getItem("ws.backend") !== "null"
      ) {
        return;
      }

      const jwt = await getJWT(session?.user.email);

      setToken(jwt);
      localStorage.setItem("ws.backend", jwt!);
    };

    setJwt();
  }, [session?.user.email]);

  useEffect(() => {
    const websocket = new WebSocket(
      "ws://localhost:8080",
      localStorage.getItem("ws.backend")!
    );

    setWs(websocket);
  }, [token]);

  return <div></div>;
}
