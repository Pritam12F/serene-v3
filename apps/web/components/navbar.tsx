"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@heroui/react";
import ThemeSwitcherButton from "./theme-switcher";
import Image from "next/image";
import { useTheme } from "next-themes";

export const BrandLogo = ({ style }: { style?: string }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeClass = mounted && resolvedTheme === "dark" ? "invert" : "";

  return (
    <Link href="/" className="inline-flex items-center mb-[1px] lg:mt-1">
      <Image
        src="/serene-logo.png"
        alt="Serene Logo"
        width={160}
        height={50}
        className={`transition-all duration-200 bg-transparent ${themeClass} ${style}`}
      />
    </Link>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Log in", href: "/sign-in" },
    { name: "Sign up", href: "/sign-up" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="overflow-y-hidden">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <BrandLogo />
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
        <NavbarItem className="ml-2">
          <Link href="/sign-in" className="hidden md:block">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/sign-up">
            <Button
              color="default"
              variant={"bordered"}
              className="hidden lg:block"
            >
              Sign up
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map(({ name, href }, index) => (
          <NavbarMenuItem key={`${name}-${index}`}>
            <Button
              className="w-full"
              href={`${href}`}
              size={"md"}
              color={"secondary"}
            >
              {name}
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
