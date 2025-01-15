import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import db from "@workspace/db";
import { users } from "@workspace/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

enum WebhookEventType {
  UserCreated = "user.created",
  UserUpdated = "user.updated",
  UserDeleted = "user.deleted",
}

async function handleUserCreated(data: any) {
  return await db.insert(users).values({
    id: uuidv4(),
    clerkId: data.id,
    name: `${data.first_name}${data.last_name ? " " + data.last_name : ""}`,
    email: data.email_addresses[0].email_address,
    profilePic: data.image_url,
  });
}

async function handleUserUpdated(data: any) {
  return await db
    .update(users)
    .set({
      name: `${data.first_name}${data.last_name ? " " + data.last_name : ""}`,
      email: data.email_addresses[0].email_address,
      profilePic: data.image_url,
    })
    .where(eq(users.clerkId, "user_2rfmunLTsfr9MNPOY9cqQJCf1Cu"));
}

async function handleUserDeleted(data: any) {
  return await db.delete(users).where(eq(users.clerkId, data.id));
}

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

  const { type, data } = evt;

  try {
    switch (type) {
      case WebhookEventType.UserCreated:
        await handleUserCreated(data);
        break;
      case WebhookEventType.UserUpdated:
        await handleUserUpdated(data);
        break;
      case WebhookEventType.UserDeleted:
        await handleUserDeleted(data);
        break;
      default:
        return new Response("Unhandled event type", { status: 400 });
    }
  } catch {
    return new Response("Error: Error modifying user entry", {
      status: 500,
    });
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
