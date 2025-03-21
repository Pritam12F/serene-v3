CREATE TABLE "workspace_audios" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"audio_url" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workspace_cover_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"cover_image_url" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "workspace_cover_images_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"image_url" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workspace_other_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"otherfile_url" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workspace_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"video_url" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "workspace_audios" ADD CONSTRAINT "workspace_audios_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_cover_images" ADD CONSTRAINT "workspace_cover_images_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_images" ADD CONSTRAINT "workspace_images_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_other_files" ADD CONSTRAINT "workspace_other_files_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_videos" ADD CONSTRAINT "workspace_videos_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;