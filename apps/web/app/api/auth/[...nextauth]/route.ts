import NextAuth from "next-auth";
import { authAuptions } from "./options";

const handler = NextAuth(authAuptions);

export { handler as GET, handler as POST };
