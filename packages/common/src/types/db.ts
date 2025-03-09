import db from "@workspace/db";
import {
  audios,
  coverImages,
  images,
  otherFiles,
  posts,
  users,
  videos,
} from "@workspace/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User Types
export type SelectUserType =
  | (typeof users.$inferSelect & {
      posts?: SelectManyPostType;
    })
  | undefined;
export type SelectManyUserType = SelectUserType[];
export type InsertUserType = typeof users.$inferInsert;
export type InsertManyUserType = InsertUserType[];

// Post Types
export type SelectPostType =
  | (typeof posts.$inferSelect & {
      parent?: SelectPostType | null;
      children?: SelectManyPostType;
      user?: SelectUserType | null;
      images?: SelectManyImageType;
      audios?: SelectManyAudioType;
      videos?: SelectManyVideoType;
      otherFiles?: SelectManyOtherFileType;
      coverImage?: SelectCoverImageType | null;
    })
  | undefined;
export type SelectManyPostType = SelectPostType[];
export type InsertPostType = typeof posts.$inferInsert;
export type InsertManyPostType = InsertPostType[];

// Image Types
export type SelectImageType =
  | (typeof images.$inferSelect & {
      post?: SelectPostType;
    })
  | undefined;
export type SelectManyImageType = SelectImageType[];
export type InsertImageType = typeof images.$inferInsert;
export type InsertManyImageType = InsertImageType[];

// Audio Types
export type SelectAudioType =
  | (typeof audios.$inferSelect & {
      post?: SelectPostType;
    })
  | undefined;
export type SelectManyAudioType = SelectAudioType[];
export type InsertAudioType = typeof audios.$inferInsert;
export type InsertManyAudioType = InsertAudioType[];

// Video Types
export type SelectVideoType =
  | (typeof videos.$inferSelect & {
      post?: SelectPostType;
    })
  | undefined;
export type SelectManyVideoType = SelectVideoType[];
export type InsertVideoType = typeof videos.$inferInsert;
export type InsertManyVideoType = InsertVideoType[];

// Other Files Types
export type SelectOtherFileType =
  | (typeof otherFiles.$inferSelect & {
      post?: SelectPostType;
    })
  | undefined;
export type SelectManyOtherFileType = SelectOtherFileType[];
export type InsertOtherFileType = typeof otherFiles.$inferInsert;
export type InsertManyOtherFileType = InsertOtherFileType[];

// Cover Image Types
export type SelectCoverImageType =
  | (typeof coverImages.$inferSelect & {
      post?: SelectPostType;
    })
  | undefined;
export type SelectManyCoverImageType = SelectCoverImageType[];
export type InsertCoverImageType = typeof coverImages.$inferInsert;
export type InsertManyCoverImageType = InsertCoverImageType[];

// Zod Schemas
export const SelectUserSchema = createSelectSchema(users);
export const InsertUserSchema = createInsertSchema(users);

export const SelectPostSchema = createSelectSchema(posts);
export const InsertPostSchema = createInsertSchema(posts);

export const SelectImageSchema = createSelectSchema(images);
export const InsertImageSchema = createInsertSchema(images);

export const SelectAudioSchema = createSelectSchema(audios);
export const InsertAudioSchema = createInsertSchema(audios);

export const SelectVideoSchema = createSelectSchema(videos);
export const InsertVideoSchema = createInsertSchema(videos);

export const SelectOtherFileSchema = createSelectSchema(otherFiles);
export const InsertOtherFileSchema = createInsertSchema(otherFiles);

export const SelectCoverImageSchema = createSelectSchema(coverImages);
export const InsertCoverImageSchema = createInsertSchema(coverImages);

//Form Schema
export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Not a valid email address" }),
  password: z.string().min(5, { message: "Password must be of length 5" }),
});

export const SignUpFormSchema = z
  .object({
    email: z.string().email({ message: "Not a valid email address" }),
    name: z.string().min(1, { message: "Name must be not empty" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least of length 5" }),
    confirmPassword: z
      .string()
      .min(5, { message: "Password must be at least of length 5" }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );
