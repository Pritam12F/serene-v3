"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LOGO_URL =
  "https://utfs.io/f/zYgyXAHp4Gqaf2hCqruQ1HXEmhsY837fCjdADxtkuvMeFGy6";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray9-400 backdrop-filter backdrop-blur-lg shadow sticky top-0 z-50 bg-opacity-70">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/external-others-inmotus-design/67/external-S-alphabet-others-inmotus-design-25.png"
                alt="external-S-alphabet-others-inmotus-design-25"
              />
            </Link>
          </div>
          <div className="hidden sm:flex justify-around items-center space-x-4">
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-gray9-400 bg-gray3-400 hover:bg-gray1-400 rounded-md hover:text-gray-900 transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors duration-300"
            >
              Join now
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray2-400 hover:text-gray1-400 focus:outline-none transition-colors duration-300"
          >
            <span className="sr-only">Toggle menu</span>
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 w-6 h-6 transition-all duration-500 ease-in-out ${isOpen ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"}`}
              />
              <X
                className={`absolute inset-0 w-6 h-6 transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-180 scale-0"}`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`sm:hidden absolute top-16 left-0 w-full bg-white shadow-lg rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          <Link
            href="/signin"
            className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-gray-700 bg-gray3-400 hover:bg-gray-200 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-black hover:bg-gray-900 transition-colors duration-300"
          >
            Join now
          </Link>
        </div>
      </div>
    </nav>
  );
}
