import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import * as jose from "jose";
import { createSecretKey } from "crypto";
import dotenv from "dotenv";
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

    if (type === "JOIN") {
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);
      if (!workspace) {
        workspaces.push({ id: payload.workspaceId, sockets: [] });

        workspaces.find((x) => x.id === payload.workspaceId)?.sockets?.push(ws);
        ws.send(
          JSON.stringify({
            type: "JOINED",
          })
        );
        return;
      }

      workspace?.sockets?.push(ws);

      ws.send(
        JSON.stringify({
          type: "JOINED",
        })
      );
    } else if (type === "LEAVE") {
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);

      if (!workspace) {
        ws.send(
          JSON.stringify({
            type: "LEFT",
          })
        );

        return;
      }

      const newSockets = workspace.sockets?.filter((x) => x !== ws);

      workspace.sockets = newSockets;

      ws.send(
        JSON.stringify({
          type: "LEFT",
        })
      );
    } else if (
      type === "UPDATE_COVER" ||
      type === "UPDATE_NAME" ||
      type === "UPDATE_EMOJI"
    ) {
      const workspace = workspaces.find((x) => x.id === payload.workspaceId);

      if (!workspace) {
        ws.send(
          JSON.stringify({
            type: "WORKSPACE_DOESN'T_EXIST",
          })
        );
      }

      workspace?.sockets?.map((socket) => {
        socket.send(
          JSON.stringify({
            type,
            payload,
          })
        );
      });
    }
  });

  ws.send(
    JSON.stringify({
      type: "CONNECTED",
    })
  );
});
