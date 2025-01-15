import { relations } from "drizzle-orm";
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
  clerkId: varchar("clerk_id", { length: 256 }).notNull(),
  name: text("name").notNull(),
  profilePic: text("profile_pic"),
  email: text("email").unique().notNull(),
  phone: integer("phone").unique(),
  password: text("password").notNull(),
});

// Images Table
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Posts Table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: varchar("name", { length: 255 }),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Images Table
export const contentImages = pgTable("content_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id), // FK to posts
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations

// Users to Posts
export const userToPosts = relations(users, ({ many }) => ({
  posts: many(posts),
}));

// Content Images to Posts
export const contentImageToPost = relations(contentImages, ({ one }) => ({
  post: one(posts, {
    fields: [contentImages.postId],
    references: [posts.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  parentPost: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
  }),
  childrenPosts: many(posts),
  // Posts to users
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  // Post to images
  images: many(contentImages),
}));
