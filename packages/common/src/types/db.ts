import db from "@workspace/db";
import {
  audios,
  coverImages,
  images,
  otherFiles,
  posts,
  users,
  videos,
  workspaces,
  workspaceImages,
  workspaceAudios,
  workspaceVideos,
  workspaceOtherFiles,
  workspaceCoverImages,
  secdondaryWorkspacesOnUsers,
} from "@workspace/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// User Types
export type SelectUserType =
  | (typeof users.$inferSelect & {
      posts?: SelectManyPostType;
      mainWorkspaces?: SelectManyWorkspaceType;
      secondaryWorkspaces?: SelectManySecondaryWorkspaceUserType;
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

// Workspace Types
export type SelectWorkspaceType =
  | (typeof workspaces.$inferSelect & {
      owner?: SelectUserType;
      members?: SelectManySecondaryWorkspaceUserType;
      images?: SelectManyWorkspaceImageType;
      audios?: SelectManyWorkspaceAudioType;
      videos?: SelectManyWorkspaceVideoType;
      otherFiles?: SelectManyWorkspaceOtherFileType;
      coverImage?: SelectWorkspaceCoverImageType | null;
    })
  | undefined;
export type SelectManyWorkspaceType = SelectWorkspaceType[];
export type InsertWorkspaceType = typeof workspaces.$inferInsert;
export type InsertManyWorkspaceType = InsertWorkspaceType[];

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

// Workspace Image Types
export type SelectWorkspaceImageType =
  | (typeof workspaceImages.$inferSelect & {
      workspace?: SelectWorkspaceType;
    })
  | undefined;
export type SelectManyWorkspaceImageType = SelectWorkspaceImageType[];
export type InsertWorkspaceImageType = typeof workspaceImages.$inferInsert;
export type InsertManyWorkspaceImageType = InsertWorkspaceImageType[];

// Workspace Audio Types
export type SelectWorkspaceAudioType =
  | (typeof workspaceAudios.$inferSelect & {
      workspace?: SelectWorkspaceType;
    })
  | undefined;
export type SelectManyWorkspaceAudioType = SelectWorkspaceAudioType[];
export type InsertWorkspaceAudioType = typeof workspaceAudios.$inferInsert;
export type InsertManyWorkspaceAudioType = InsertWorkspaceAudioType[];

// Workspace Video Types
export type SelectWorkspaceVideoType =
  | (typeof workspaceVideos.$inferSelect & {
      workspace?: SelectWorkspaceType;
    })
  | undefined;
export type SelectManyWorkspaceVideoType = SelectWorkspaceVideoType[];
export type InsertWorkspaceVideoType = typeof workspaceVideos.$inferInsert;
export type InsertManyWorkspaceVideoType = InsertWorkspaceVideoType[];

// Workspace Other Files Types
export type SelectWorkspaceOtherFileType =
  | (typeof workspaceOtherFiles.$inferSelect & {
      workspace?: SelectWorkspaceType;
    })
  | undefined;
export type SelectManyWorkspaceOtherFileType = SelectWorkspaceOtherFileType[];
export type InsertWorkspaceOtherFileType =
  typeof workspaceOtherFiles.$inferInsert;
export type InsertManyWorkspaceOtherFileType = InsertWorkspaceOtherFileType[];

// Workspace Cover Image Types
export type SelectWorkspaceCoverImageType =
  | (typeof workspaceCoverImages.$inferSelect & {
      workspace?: SelectWorkspaceType;
    })
  | undefined;
export type SelectManyWorkspaceCoverImageType = SelectWorkspaceCoverImageType[];
export type InsertWorkspaceCoverImageType =
  typeof workspaceCoverImages.$inferInsert;
export type InsertManyWorkspaceCoverImageType = InsertWorkspaceCoverImageType[];

// Zod Schemas
export const SelectUserSchema = createSelectSchema(users);
export const InsertUserSchema = createInsertSchema(users);

export const SelectPostSchema = createSelectSchema(posts);
export const InsertPostSchema = createInsertSchema(posts);

export const SelectWorkspaceSchema = createSelectSchema(workspaces);
export const InsertWorkspaceSchema = createInsertSchema(workspaces);

export const SelectSecondaryWorkspaceUserSchema = createSelectSchema(
  secdondaryWorkspacesOnUsers
);
export const InsertSecondaryWorkspaceUserSchema = createInsertSchema(
  secdondaryWorkspacesOnUsers
);

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

export const SelectWorkspaceImageSchema = createSelectSchema(workspaceImages);
export const InsertWorkspaceImageSchema = createInsertSchema(workspaceImages);

export const SelectWorkspaceAudioSchema = createSelectSchema(workspaceAudios);
export const InsertWorkspaceAudioSchema = createInsertSchema(workspaceAudios);

export const SelectWorkspaceVideoSchema = createSelectSchema(workspaceVideos);
export const InsertWorkspaceVideoSchema = createInsertSchema(workspaceVideos);

export const SelectWorkspaceOtherFileSchema =
  createSelectSchema(workspaceOtherFiles);
export const InsertWorkspaceOtherFileSchema =
  createInsertSchema(workspaceOtherFiles);

export const SelectWorkspaceCoverImageSchema =
  createSelectSchema(workspaceCoverImages);
export const InsertWorkspaceCoverImageSchema =
  createInsertSchema(workspaceCoverImages);
