DROP TABLE "workspace_audios" CASCADE;--> statement-breakpoint
DROP TABLE "workspace_images" CASCADE;--> statement-breakpoint
DROP TABLE "workspace_other_files" CASCADE;--> statement-breakpoint
DROP TABLE "workspace_videos" CASCADE;--> statement-breakpoint
ALTER TABLE "workspaces" DROP COLUMN "workspace_content";