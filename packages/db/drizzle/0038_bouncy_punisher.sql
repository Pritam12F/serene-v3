ALTER TABLE "workspaces" ALTER COLUMN "workspace_content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "invite_id" varchar(5);