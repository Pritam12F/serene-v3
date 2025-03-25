import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import * as jose from "jose";
import { createSecretKey } from "crypto";
import dotenv from "dotenv";
import { updateContent } from "./db.js";
import url from "url";

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
const workspaces: Workspace[] = [];

wss.on("connection", async function connection(ws, req) {
  ws.on("error", console.error);
  const token = url.parse(req.url!, true).query.token;
  if (!token) {
    ws.close();
  } else {
    if (!(await verifyUser(token as string))) {
      ws.close();
    }
  }

  ws.on("message", function message(data) {
    const { type, payload } = JSON.parse(data.toString());

    if (type === "join") {
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);
      if (!workspace) {
        workspaces.push({ id: payload.workspaceId, sockets: [] });

        workspaces.find((x) => x.id === payload.workspaceId)?.sockets?.push(ws);
        ws.send(`Joined workspace ${payload.workspaceId}`);
        return;
      }

      workspace?.sockets?.push(ws);

      ws.send(`Joined workspace ${payload.workspaceId}`);
    } else if (type === "leave") {
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);

      if (!workspace) {
        ws.send(`Workspace with id ${payload.workspaceId} doesn't exist`);

        return;
      }

      const newSockets = workspace.sockets?.filter((x) => x !== ws);

      workspace.sockets = newSockets;

      ws.send(`Left workspace with id ${payload.workspaceId}`);
    } else if (type === "updateContent") {
      const content = payload.content;
      updateContent(payload.workspaceId, content);
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);

      if (!workspace) {
        ws.send(`Workspace with id ${payload.workspaceId} doesn't exist`);

        return;
      }

      workspace.sockets?.forEach((socket) => {
        if (socket !== ws && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "updateContent",
              payload: {
                content,
              },
            })
          );
        }
      });
    }
  });

  ws.send("Connected to server!!");
});
