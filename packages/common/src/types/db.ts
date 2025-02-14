import { images, posts, users } from "@workspace/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export type SelectUserType = typeof users.$inferSelect | undefined;
export type InsertUserType = typeof users.$inferInsert;

export type SelectPostType = typeof posts.$inferSelect | undefined;
export type InsertPostType = typeof posts.$inferInsert;

export type SelectImageType = typeof images.$inferSelect | undefined;
export type InsertImageType = typeof images.$inferInsert;

export const SelectUserSchema = createSelectSchema(users).extend({});
export const InsertUserSchema = createInsertSchema(users).extend({});

export const SelectPostSchema = createSelectSchema(posts).extend({});
export const InsertPostSchema = createInsertSchema(posts).extend({});

export const SelectImageSchema = createSelectSchema(images).extend({});
export const InsertImageSchema = createInsertSchema(images).extend({});
