import Link from "next/link";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-18 sm:grid-cols-12">
          <div className="ml-8 col-span-9 sm:mx-5 sm:col-span-5 md:col-span-6 lg:col-span-6">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-blue-600 dark:text-blue-400"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="font-bold text-2xl text-gray-800 dark:text-gray-200">
                Serene
              </span>
            </Link>
          </div>
          <div className="ml-9 mt-6 sm:mt-0 col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-6 ml-8 sm:mt-0 col-span-3 mr-10 sm:col-span-3 md:col-span-3 lg:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaDiscord className="w-6 h-6" />
                <span className="sr-only">Discord</span>
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaGithub className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaTwitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Serene. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
