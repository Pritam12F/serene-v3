import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { users } from "../../../../../../packages/db/src/schema";
import { v4 as uuidv4 } from "uuid";
import db from "@workspace/db";

export const authAuptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          type: "text",
          placeholder: "Enter email",
        },
        password: {
          type: "password",
          placeholder: "Enter password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const user = await db.query.users.findFirst({
            where: (model, { eq }) => eq(model.email, credentials.email),
          });

          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          if (!user) {
            const signUpUser = await db.insert(users).values({
              id: uuidv4(),
              name: "HITHERE",
              email: credentials.name,
              phone: 1234,
              password: hashedPassword,
            });

            return signUpUser;
          }

          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
};
