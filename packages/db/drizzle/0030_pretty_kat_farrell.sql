CREATE TYPE "public"."account_type" AS ENUM('credentials', 'google', 'github');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "account_type" "account_type" NOT NULL;