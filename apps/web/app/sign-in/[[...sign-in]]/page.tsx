import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex justify-center items-center bg-white dark:bg-slate-950">
      <SignIn fallbackRedirectUrl="/documents" />
    </div>
  );
}
