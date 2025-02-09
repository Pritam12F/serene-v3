import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  clerkId: varchar("clerk_id", {length: 256}).notNull(),
  name: text("name").notNull(),
  profilePic: text("profile_pic"),
  email: text("email").unique().notNull(),
  phone: integer("phone").unique(),
});

// Images Table
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("url").notNull(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Posts Table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  content: jsonb("content").notNull(),
  emoji: text("emoji"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: integer("parent_id").references((): AnyPgColumn => posts.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations

// Users to Posts
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

// Images to Posts
export const imagesRelations = relations(images, ({ one }) => ({
  post: one(posts, {
    fields: [images.postId],
    references: [posts.id],
  }),
}));

// Posts Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  // Post parent/child relationships
  parent: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
  }),
  children: many(posts),
  // Posts to users
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  // Posts to images
  images: many(images),
}));
