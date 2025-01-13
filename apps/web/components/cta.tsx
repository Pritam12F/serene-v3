"use client";
import { TypewriterEffectSmooth } from "@workspace/ui/components/aceternityui/typewriter-effect";

export function TypewriterEffect() {
  const words = [
    {
      text: "Ready",
    },
    {
      text: "to",
    },
    {
      text: "bring",
    },
    {
      text: "serenity",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "to",
    },
    {
      text: "your",
    },
    {
      text: "workflow?",
    },
  ];
  return (
    <div className="flex flex-col border-none shadow-none bg-white dark:bg-gray-950 items-center justify-center h-[30rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        Join thousands of users who use Serene
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-slate-900 dark:bg-gray-50 dark:text-black font-semibold dark:hover:bg-white hover:shadow-lg hover:bg-black duration-200 border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
      </div>
    </div>
  );
}
