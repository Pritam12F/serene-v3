ALTER TABLE "posts" RENAME COLUMN "active_cover_id" TO "cover_id";--> statement-breakpoint
ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "active_state";