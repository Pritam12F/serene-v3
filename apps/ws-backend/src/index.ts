import express from "express";
import { WebSocketServer } from "ws";
import * as jose from "jose";
import { createSecretKey } from "crypto";
import dotenv from "dotenv";

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

wss.on("connection", async function connection(ws) {
  ws.on("error", console.error);

  if (!ws.protocol) {
    ws.close();
  } else {
    if (!(await verifyUser(ws.protocol))) {
      ws.close();
    }
  }

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.send("Hello! Message From Server!!");
});
