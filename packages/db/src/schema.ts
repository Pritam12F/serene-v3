import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
  AnyPgColumn,
  jsonb,
  pgEnum,
  bigint,
  primaryKey,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "credentials",
  "google",
  "github",
]);

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  profilePic: text("profile_pic"),
  email: text("email").unique().notNull(),
  phone: bigint({ mode: "number" }).unique(),
  accountType: accountTypeEnum("account_type").notNull(),
  hashedPassword: text("hashed_password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts Table
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  content: jsonb("content").notNull(),
  emoji: text("emoji"),
  coverImageId: integer("cover_id"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references((): AnyPgColumn => posts.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workspace Table
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  emoji: text("emoji"),
  coverImageId: integer("cover_id"),
  content: jsonb("workspace_content"),
  inviteId: varchar("invite_id", { length: 5 }),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// JOIN TABLE
export const secondaryWorkspacesUsers = pgTable(
  "workspaces_secondary_users",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.workspaceId] }),
    };
  }
);

// Images Table
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("image_url").notNull(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audios Table
export const audios = pgTable("audios", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("audio_url").notNull(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Videos Table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("video_url").notNull(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Other Files Table
export const otherFiles = pgTable("other_files", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("otherfile_url").notNull(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cover Images Table
export const coverImages = pgTable("cover_images", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("cover_image_url").notNull(),
  postId: uuid("post_id")
    .unique()
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workspace Images Table
export const workspaceImages = pgTable("workspace_images", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("image_url").notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workspace Audios Table
export const workspaceAudios = pgTable("workspace_audios", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("audio_url").notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workspace Videos Table
export const workspaceVideos = pgTable("workspace_videos", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("video_url").notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workspace Other Files Table
export const workspaceOtherFiles = pgTable("workspace_other_files", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("otherfile_url").notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workspace Cover Images Table
export const workspaceCoverImages = pgTable("workspace_cover_images", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: text("cover_image_url").notNull(),
  workspaceId: uuid("workspace_id")
    .unique()
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations

// Users to Posts
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  mainWorkspaces: many(workspaces),
  secondaryWorkspaces: many(secondaryWorkspacesUsers),
}));

//Workspace Relations
export const workspaceRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(secondaryWorkspacesUsers),
  coverImage: one(workspaceCoverImages, {
    fields: [workspaces.coverImageId],
    references: [workspaceCoverImages.id],
  }),
  images: many(workspaceImages),
  audios: many(workspaceAudios),
  videos: many(workspaceVideos),
  otherFiles: many(workspaceOtherFiles),
}));

export const secondaryWorkspacesUsersRelations = relations(
  secondaryWorkspacesUsers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [secondaryWorkspacesUsers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [secondaryWorkspacesUsers.userId],
      references: [users.id],
    }),
  })
);

// Workspace media relations
export const workspaceImagesRelations = relations(
  workspaceImages,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceImages.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const workspaceAudiosRelations = relations(
  workspaceAudios,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceAudios.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const workspaceVideosRelations = relations(
  workspaceVideos,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceVideos.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const workspaceOtherFilesRelations = relations(
  workspaceOtherFiles,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceOtherFiles.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const workspaceCoverImagesRelations = relations(
  workspaceCoverImages,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceCoverImages.workspaceId],
      references: [workspaces.id],
    }),
  })
);

// Images to Posts
export const imagesRelations = relations(images, ({ one }) => ({
  post: one(posts, {
    fields: [images.postId],
    references: [posts.id],
  }),
}));

// Audios to Posts
export const audiosRelations = relations(audios, ({ one }) => ({
  post: one(posts, {
    fields: [audios.postId],
    references: [posts.id],
  }),
}));

// Videos to Posts
export const videosRelations = relations(videos, ({ one }) => ({
  post: one(posts, {
    fields: [videos.postId],
    references: [posts.id],
  }),
}));

// Other Files to Posts
export const otherFilesRelations = relations(otherFiles, ({ one }) => ({
  post: one(posts, {
    fields: [otherFiles.postId],
    references: [posts.id],
  }),
}));

// Cover Images to Posts
export const coverImagesRelations = relations(coverImages, ({ one }) => ({
  post: one(posts, {
    fields: [coverImages.postId],
    references: [posts.id],
  }),
}));

// Posts Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  // Post parent relationship
  parent: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "self_post_relation",
  }),
  // Post children relationship
  children: many(posts, {
    relationName: "self_post_relation",
  }),
  // Posts to users
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),

  // Media relations
  images: many(images),
  audios: many(audios),
  videos: many(videos),
  otherFiles: many(otherFiles),
  coverImage: one(coverImages, {
    fields: [posts.coverImageId],
    references: [coverImages.id],
  }),
}));
