"use client";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useRouter } from "next/navigation";

export const Hamburger = () => {
  const router = useRouter();
  return (
    <div className="md:hidden mx-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="bg-transparent hover:bg-transparent focus:outline-none focus:ring-0 border-none shadow-none"
          >
            <div>
              <span
                className="bg-slate-200 block transition-all duration-300 ease-out 
            h-[3.2px] w-5 rounded-sm transform-gpu -translate-y-[2px]"
              ></span>
              <span
                className="bg-slate-200 block transition-all duration-300 ease-out 
            h-[3.2px] w-5 rounded-sm my-0.5 opacity-100"
              ></span>
              <span
                className="bg-slate-200 block transition-all duration-300 ease-out 
            h-[3.2px] w-5 rounded-sm transform-gpu translate-y-[2px]"
              ></span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="md:hidden">
          <DropdownMenuItem
            className="font-semibold"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Sign in
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-semibold"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
