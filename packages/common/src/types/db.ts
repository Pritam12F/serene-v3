import { images, posts, users } from "@workspace/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

//Types

// 1. User types
export type SelectUserType =
  | (typeof users.$inferSelect & {
      posts?: SelectManyPostType | null;
    })
  | undefined;
export type SelectManyUserType = (typeof users.$inferSelect & {
  posts?: SelectManyPostType | null;
})[];
export type InsertUserType = typeof users.$inferInsert;
export type InsertManyUserType = (typeof users.$inferInsert)[];

// 2. User Types
export type SelectPostType =
  | (typeof posts.$inferSelect & {
      parent?: SelectPostType | null;
      children?: SelectManyPostType;
      images?: SelectManyImageType;
      user?: SelectUserType;
    })
  | undefined;
export type SelectManyPostType = (typeof posts.$inferSelect & {
  parent?: SelectPostType | null;
  children?: SelectManyPostType;
  images?: SelectManyImageType;
  user?: SelectUserType;
})[];
export type InsertPostType = typeof posts.$inferInsert;
export type InsertManyPostType = (typeof posts.$inferInsert)[];

// 3. Image Types
export type SelectImageType =
  | (typeof images.$inferSelect & {
      post?: SelectPostType;
    })
  | undefined;
export type SelectManyImageType = (typeof images.$inferSelect & {
  post?: SelectPostType;
})[];
export type InsertImageType = typeof images.$inferInsert;
export type InsertManyImageType = (typeof images.$inferInsert)[];

// Schemas
export const SelectUserSchema = createSelectSchema(users).extend({});
export const InsertUserSchema = createInsertSchema(users).extend({});

export const SelectPostSchema = createSelectSchema(posts).extend({});
export const InsertPostSchema = createInsertSchema(posts).extend({});

export const SelectImageSchema = createSelectSchema(images).extend({});
export const InsertImageSchema = createInsertSchema(images).extend({});
