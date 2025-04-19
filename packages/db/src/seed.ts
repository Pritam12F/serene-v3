import db from "@workspace/db";
import { posts } from "@workspace/db/schema";

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

const quickNote: Content[] = [
  {
    id: "5c700997-2e18-43e9-aedd-ff2926ac27ea",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "f9e7ab80-3354-43de-8c48-cf1e630143b4",
    type: ContentType.Heading,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
      level: 2,
    },
    content: [
      {
        type: "text",
        text: "Jot down some text",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "5b3bab99-629e-471f-a0d4-84e0c4228df4",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "b0661ef9-3ce1-45f5-9749-fdd02496279e",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Write down some quick notes related to your studies, work, etc!",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "c81b9dc0-016b-4984-ad01-c6d81579e67e",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "96fabe57-a772-4139-a66f-d140a0553cf5",
    type: ContentType.Heading,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
      level: 3,
    },
    content: [
      {
        type: "text",
        text: "Make a to-do list",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "67a9cec0-5092-4cab-8e5f-a22103ed3014",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "865b0c1a-2b79-41e6-8512-586e180ee1e7",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Wake up",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "cbab3b7e-0eae-4e02-9ca7-e895a6edfe75",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Freshen up ",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "9610ffdc-aca8-49dd-8117-74f0466c1491",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Go to Gym",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "19115331-aa1a-4230-a039-dd2fdd46690f",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Code",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "c8953136-5f4c-4019-abfd-ed5d45dc3a32",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
];

const personalHome: Content[] = [
  {
    id: "ab4f77cd-2aea-4a0a-99eb-bc37aa239ed9",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Organize everything in your life in one place.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "a213c638-ef4c-4a7d-aa23-fe1980c8f666",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "d2313625-1083-4ff4-a8d3-400d0fc51314",
    type: ContentType.Heading,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
      level: 2,
    },
    content: [
      {
        type: "text",
        text: "🎥 Movie recommendations",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "f59297d7-b732-4b75-a79a-7e3703b8216f",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "1dad5612-bb93-492d-9760-4964c3870eb2",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: " Inception",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "5dcf5017-dc33-47ca-ba44-bc74a273c55c",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Interstellar",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "c8953136-5f4c-4019-abfd-ed5d45dc3a32",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "7d04e515-49a5-40c5-bc6d-85e0673060dd",
    type: ContentType.Heading,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
      level: 2,
    },
    content: [
      {
        type: "text",
        text: "📺 Anime recommendations",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "0dfdfceb-7a4c-407a-87d2-6aa5141507d3",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "40c2b4f7-257a-44b7-825f-e4e8fb35f650",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Dragon Ball Super",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "5f7a0b5b-09d8-49b5-9693-723b082cb64c",
    type: ContentType.NumberedListItem,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Death Note",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "a33ee278-6a23-498c-b975-4f6324d8176a",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
];

const readingList: Content[] = [
  {
    id: "d09ae947-55ae-43be-92bb-25d8b23c10ae",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "The modern day reading list includes more than just books. We've created a dashboard to help you track books, articles, podcasts, and videos.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "81dc4b4b-1b76-4b7b-8d70-a82b82ce9817",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "baadaac0-99eb-4ee0-a6d8-bd3e968b672e",
    type: ContentType.Heading,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
      level: 2,
    },
    content: [
      {
        type: "text",
        text: "Current List",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "4c6e3f3c-0e5b-4951-8661-1054cd5b5f48",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
  {
    id: "2e7db0e9-beae-4373-8559-8202a6092693",
    type: ContentType.Table,
    props: {
      textColor: "default",
    },
    content: {
      type: "tableContent",
      columnWidths: [null, null, null, 157],
      rows: [
        {
          cells: [
            [
              {
                type: "text",
                text: "Name",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Type",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Status",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Link",
                styles: {},
              },
            ],
          ],
        },
        {
          cells: [
            [
              {
                type: "text",
                text: "The Laws of Human Nature",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Book",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "In Progress",
                styles: {},
              },
            ],
            [],
          ],
        },
        {
          cells: [
            [
              {
                type: "text",
                text: "Next.js",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Coding",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Done",
                styles: {},
              },
            ],
            [],
          ],
        },
        {
          cells: [
            [
              {
                type: "text",
                text: "Docker",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "DevOps",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "In Progress",
                styles: {},
              },
            ],
            [],
          ],
        },
        {
          cells: [
            [
              {
                type: "text",
                text: "Go",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Coding",
                styles: {},
              },
            ],
            [
              {
                type: "text",
                text: "Not Started",
                styles: {},
              },
            ],
            [],
          ],
        },
      ],
    },
    children: [],
  },
  {
    id: "417c49d2-787c-419f-bc22-dad0194c7bc4",
    type: ContentType.Paragraph,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
];

export async function createInitialPosts(userId: string) {
  await db.insert(posts).values({
    name: "Quick Note",
    userId,
    content: quickNote,
    emoji: "📓",
    isFavorite: true,
  });

  await db.insert(posts).values({
    name: "Personal Home",
    userId,
    content: personalHome,
    emoji: "🏠",
    isFavorite: true,
  });

  await db.insert(posts).values({
    name: "Reading List",
    userId,
    content: readingList,
    emoji: "📖",
    isFavorite: true,
  });
}
