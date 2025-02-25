CREATE TABLE IF NOT EXISTS "cover_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"cover_image_url" text NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "audios" RENAME COLUMN "url" TO "audio_url";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "url" TO "image_url";--> statement-breakpoint
ALTER TABLE "other_files" RENAME COLUMN "url" TO "otherfile_url";--> statement-breakpoint
ALTER TABLE "videos" RENAME COLUMN "url" TO "video_url";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cover_images" ADD CONSTRAINT "cover_images_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
