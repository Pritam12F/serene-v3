import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    phone?: number | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      phone?: number | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    phone?: number | null;
  }
}
