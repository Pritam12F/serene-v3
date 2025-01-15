import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import db from "@workspace/db";
import { users } from "@workspace/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const { id, image_url, email_addresses, first_name, last_name } =
    evt.data as any;
  const { type } = evt;
  const email = email_addresses[0].email_address;

  if (type === "user.created") {
    try {
      await db.insert(users).values({
        id: uuidv4(),
        clerkId: id,
        name: `${first_name} ${last_name}`,
        email,
        profilePic: image_url,
      });
    } catch (err) {
      console.error("Error occured:", err);
      return new Response(
        "Error: Couldn't add user to database or it already exists",
        {
          status: 400,
        }
      );
    }
  }

  return new Response("Webhook received", { status: 200 });
}
