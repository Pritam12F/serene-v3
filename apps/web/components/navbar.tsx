import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-gray-900/80">
      <Link href="/" className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-blue-600 dark:text-blue-400"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="font-bold text-xl text-gray-800 dark:text-gray-200">
          Serene
        </span>
      </Link>
      <nav className="hidden md:flex space-x-4 md:space-x-10">
        <Link
          href="#features"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          Features
        </Link>
        <Link
          href="#"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          Pricing
        </Link>
        <Link
          href="#"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          Blog
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          Log in
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          Sign up
        </Button>
      </div>
    </header>
  );
}
