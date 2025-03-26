import { SignIn } from "@/components/signin";
import { Suspense } from "react";
import Loading from "../loading";

export default function SignInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignIn />
    </Suspense>
  );
}
