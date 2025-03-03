import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@workspace/db";
import { eq } from "drizzle-orm";
import { users } from "@workspace/db/schema";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials?.email && credentials.password) {
          try {
            const userDb = await db.query.users.findFirst({
              where: eq(users.email, credentials.email),
              with: {
                posts: true,
              },
            });

            if (!userDb) {
              throw new Error("No user exists with this email address");
            }

            const isPasswordCorrect = await bcrypt.compare(
              userDb.hashedPassword!,
              credentials.password
            );

            if (isPasswordCorrect) {
              return {
                id: userDb.id,
                name: userDb.name,
                email: userDb.email,
                image: userDb.profilePic,
                phone: userDb.phone,
              };
            }
            throw new Error("Password is incorrect");
          } catch (err) {
            throw err;
          }
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          image: user.image,
          email: user.email,
          phone: user.phone,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.name = token.name;
        session.user.phone = token.phone;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthOptions;
