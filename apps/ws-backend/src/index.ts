import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import * as jose from "jose";
import { createSecretKey } from "crypto";
import dotenv from "dotenv";
import db from "@workspace/db";
import { eq } from "drizzle-orm";
import { workspaces } from "@workspace/db/schema";

dotenv.config();

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

const verifyUser = async (tk: string) => {
  const secretKey = createSecretKey(
    process.env.NEXTAUTH_SECRET ?? "SECRET",
    "utf-8"
  );

  try {
    await jose.jwtVerify(tk, secretKey);

    return true;
  } catch (e) {
    console.error(e);
    console.log("Token is invalid");

    return false;
  }
};

interface Workspace {
  id: string;
  sockets?: WebSocket[];
}

// const workspaces: Workspace[] = await db.query.workspaces.findMany({
//   where: eq(workspaces.id),
// });

wss.on("connection", async function connection(ws) {
  ws.on("error", console.error);

  if (!ws.protocol) {
    ws.close();
  } else {
    if (!(await verifyUser(ws.protocol))) {
      ws.close();
    }
  }

  ws.on("message", function message(data) {
    const { type, payload } = JSON.parse(data.toString());

    if (type === "join") {
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);

      workspace?.sockets?.push(ws);

      ws.send(`Joined workspace ${payload.workspaceId}`);
    } else if (type === "update") {
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);

      workspace?.sockets?.forEach((socket) => {
        if (socket !== ws && socket.readyState === WebSocket.OPEN) {
          socket.send(payload.content);
        }
      });
    }
  });

  ws.send("Hello! Message From Server!!");
});
