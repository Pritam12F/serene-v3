"use server";

import { createSecretKey } from "crypto";
import { SignJWT } from "jose";

export async function getJWT(email?: string) {
  if (!email) {
    return null;
  }

  const secretKey = createSecretKey(
    process.env.NEXTAUTH_SECRET ?? "SECRET",
    "utf-8"
  );
  const token = await new SignJWT({ email: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secretKey);

  return token;
}
