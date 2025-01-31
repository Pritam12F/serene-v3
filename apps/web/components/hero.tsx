import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { Ripple } from "@workspace/ui/components/magicui/ripple";

export default function Hero() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 text-center bg-gradient-to-b relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-white to-transparent opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 bg-clip-text py-4 text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
          Your thoughts, organized{" "}
          <span className="text-blue-600 dark:text-blue-600">serenely</span>
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
          Serene is the all-in-one workspace for your notes, tasks, and ideas.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            size="lg"
            className="bg-blue-600 text-white duration-300 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Watch Demo
          </Button>
        </div>
      </div>
      <div className="mt-12 flex justify-center relative">
        <Image
          src="/image1.jpg"
          alt="Serene app interface"
          width={800}
          height={600}
          className="rounded-lg shadow-2xl duration-150 hover:scale-105 border border-gray-200 z-20 dark:border-gray-700"
        />
      </div>
      <Ripple />
    </section>
  );
}
