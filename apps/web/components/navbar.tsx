"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import { Button } from "@workspace/ui/components/button";
import ThemeSwitcherButton from "./theme-switcher";

export const SereneLogo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-blue-600 dark:text-blue-600"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span className="font-bold text-xl text-gray-800 dark:text-gray-200">
        Serene
      </span>
    </Link>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Log in", href: "/sign-in" },
    { name: "Sign up", href: "/sign-up" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <SereneLogo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link aria-current="page" href="#">
            Pricing
          </Link>
        </NavbarItem>
        <NavbarItem className="mx-2">
          <Link color="foreground" href="#">
            Blog
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="space-x-3">
        <NavbarItem className="translate-x-14 md:translate-x-3">
          <ThemeSwitcherButton />
        </NavbarItem>
        <NavbarItem>
          <Link href="/sign-in" className="hidden md:block">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/sign-up">
            <Button
              color="default"
              variant="default"
              className="hidden rounded-md bg-gradient-to-b from-blue-400 via-blue-500 to-blue-800 text-gray-100 hover:text-white dark:hover:text-white duration-300 md:inline-flex"
            >
              Sign up
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map(({ name, href }, index) => (
          <NavbarMenuItem key={`${name}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href={`${href}`}
              size="lg"
            >
              {name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
