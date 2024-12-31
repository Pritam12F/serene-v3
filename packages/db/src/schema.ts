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
  name: text("name").notNull(),
  profilePic: text("profile_pic"),
  email: text("email").unique().notNull(),
  phone: integer("phone").unique(),
  password: text("password").notNull(),
});

// Images Table
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id), // FK to users
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
    .references(() => users.id), // FK to users
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

// Users to Images
export const userToImage = relations(users, ({ many }) => ({
  images: many(images),
}));

// Images to Users
export const imageToUser = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.userId],
    references: [users.id],
  }),
}));

// Users to Posts
export const userToPosts = relations(users, ({ many }) => ({
  posts: many(posts),
}));

// Posts to Users
export const postToUser = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

// Posts to Content Images
export const postToContentImages = relations(posts, ({ many }) => ({
  images: many(contentImages),
}));

// Content Images to Posts
export const contentImageToPost = relations(contentImages, ({ one }) => ({
  post: one(posts, {
    fields: [contentImages.postId],
    references: [posts.id],
  }),
}));
