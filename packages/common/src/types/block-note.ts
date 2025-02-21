export enum ContentType {
  Paragraph = "paragraph",
  Heading = "heading",
  NumberedListItem = "numberedListItem",
  BulletListItem = "bulletListItem",
  CheckListItem = "checkListItem",
  Image = "image",
  Video = "video",
  Audio = "audio",
  File = "file",
  Code = "codeBlock",
  Table = "table",
}

export type Content = {
  id: string;
  type: ContentType;
  props: Record<string, string | number | boolean>;
  content: Record<string, any>[] | Record<string, any>;
  children: Record<string, any>[];
};
