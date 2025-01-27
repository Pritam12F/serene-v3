import { images, posts, users } from "@workspace/db/schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export type SelectUserType =
  | (InferSelectModel<typeof users> & {
      posts?: SelectPostType[];
    })
  | undefined;
export type InsertUserType = InferInsertModel<typeof users>;

export type SelectPostType =
  | (InferSelectModel<typeof posts> & {
      images?: SelectImageType[];
      user?: SelectUserType;
      parent?: SelectPostType;
      children?: SelectPostType[];
    })
  | undefined;
export type InsertPostType = InferInsertModel<typeof posts>;

export type SelectImageType =
  | (InferSelectModel<typeof images> & {
      post?: SelectPostType;
    })
  | undefined;
export type InsertImageType = InferInsertModel<typeof images>;

export const SelectUserSchema = createSelectSchema(users).extend({});
export const InsertUserSchema = createInsertSchema(users).extend({});

// Fix Types
export const SelectPostSchema = createSelectSchema(posts).extend({});
export const InsertPostSchema = createInsertSchema(posts).extend({});

export const SelectImageSchema = createSelectSchema(images).extend({});
export const InsertImageSchema = createInsertSchema(images).extend({});
