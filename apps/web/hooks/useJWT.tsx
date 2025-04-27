import { getJWT } from "@/server";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useJWT = () => {
  const session = useSession();
  const [token, setToken] = useState("");

  useEffect(() => {
    const setJwt = async () => {
      if (
        localStorage.getItem("ws.backend") &&
        localStorage.getItem("ws.backend") !== "null"
      ) {
        return;
      }

      const jwt = await getJWT(session?.data?.user.email);

      localStorage.setItem("ws.backend", jwt!);
      setToken(jwt!);
    };

    setJwt();
  }, [session?.data?.user.email]);

  return { token };
};
