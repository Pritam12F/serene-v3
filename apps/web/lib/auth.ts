import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@workspace/db";
import { eq } from "drizzle-orm";
import { users } from "@workspace/db/schema";
import { createInitialPosts } from "@workspace/db/seed";
import { randomGradient } from "./random-gradient";

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
              return null;
            }

            if (userDb.accountType !== "credentials") {
              return null;
            }

            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              userDb.hashedPassword!
            );

            if (!isPasswordCorrect) {
              return null;
            }

            return {
              id: userDb.id,
              name: userDb.name,
              email: userDb.email,
              image: userDb.profilePic,
              phone: userDb.phone,
              profileColor: userDb.profileColor,
              coverColor: userDb.coverColor,
            };
          } catch (err) {
            return null;
          }
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GH_ID ?? "",
      clientSecret: process.env.GH_SECRET ?? "",
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
          profileColor: user.profileColor,
          coverColor: user.coverColor,
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
        session.user.profileColor = token.profileColor;
        session.user.coverColor = token.coverColor;
      }

      return session;
    },
    async signIn({ account, user }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const isUserInDB = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        user.id = isUserInDB?.id!;

        if (!isUserInDB) {
          const userId = await db
            .insert(users)
            .values({
              name: user.name,
              email: user.email,
              accountType: account.provider,
              profileColor: randomGradient(),
              coverColor: randomGradient(),
            })
            .returning({ userId: users.id });

          user.id = userId[0]!.userId;

          await createInitialPosts(userId[0]!.userId);
        } else if (isUserInDB && isUserInDB.accountType !== account.provider) {
          return `/sign-in?error=${encodeURIComponent("User is already registered with other method")}`;
        }
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthOptions;
