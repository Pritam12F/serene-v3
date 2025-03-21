"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getJWT } from "@/server/auth";
import { useWebsocket } from "@/hooks/use-websocket";

export default function Workspaces() {
  const { data: session } = useSession();
  const [_token, setToken] = useState<string | null>(null);
  const { isReady, ws } = useWebsocket("ws://localhost:8080", [_token]);

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

  return (
    <div>
      <div>{!isReady && <div>Loading...</div>}</div>
    </div>
  );
}
