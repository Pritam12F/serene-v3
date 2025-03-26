import Loader from "@/components/loading";
import { SignIn } from "@/components/signin";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SignIn />
    </Suspense>
  );
}
