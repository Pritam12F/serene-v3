import { images, posts, users } from "@workspace/db/schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export type SelectUser =
  | (InferSelectModel<typeof users> & {
      posts?: SelectPost[];
    })
  | undefined;
export type InsertUser = InferInsertModel<typeof users>;

export type SelectPost =
  | (InferSelectModel<typeof posts> & {
      images?: SelectImage[];
      user?: SelectUser;
      parent?: SelectPost;
      children?: SelectPost[];
    })
  | undefined;
export type InsertPost = InferInsertModel<typeof posts>;

export type SelectImage =
  | (InferSelectModel<typeof images> & {
      post?: SelectPost;
    })
  | undefined;
export type InsertImage = InferInsertModel<typeof images>;
