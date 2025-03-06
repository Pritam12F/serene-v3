import { BackgroundLines } from "@workspace/ui/components/background-lines";
import Link from "next/link";

export default function Hero() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Your{" "}
        <p className="inline bg-gradient-to-b from-blue-400 via-blue-500 to-blue-800 bg-clip-text text-transparent">
          thoughts
        </p>
        , organized
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Serene is the all-in-one workspace for your notes, tasks, and ideas.
      </p>
      <Link href="/sign-up" className="z-30 mt-10">
        <button className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
          Sign up now
        </button>
      </Link>
    </BackgroundLines>
  );
}
