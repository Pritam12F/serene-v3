"use client";

import { SignIn } from "@/components/signin";
import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInPage() {
  const { data: session } = useSession();

  return <SignIn />;
}
