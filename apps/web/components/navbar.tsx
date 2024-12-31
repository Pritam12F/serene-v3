"use client";

import { Button } from "@workspace/ui/components/button";
import { Hamburger } from "./dropdown-menu";
import { useRouter } from "next/navigation";

const LOGO_URL =
  "https://utfs.io/f/zYgyXAHp4Gqaf2hCqruQ1HXEmhsY837fCjdADxtkuvMeFGy6";

export const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="flex bg-gray9-400 p-2 justify-between items-center sticky top-0 z-50 backdrop-filter backdrop-blur-lg bg-opacity-85">
      <div className="w-12 h-12 mx-2">
        <img src={LOGO_URL} className="rounded-md" />
      </div>
      <div className="hidden md:block">
        <Button
          variant={"secondary"}
          className="w-32 mx-3 bg-white"
          onClick={() => {
            router.push("/signin");
          }}
        >
          Sign in
        </Button>
        <Button
          variant={"secondary"}
          className="w-32 mx-3 bg-gray6-400 text-white hover:bg-gray8-400 hover:border-2"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Sign up
        </Button>
      </div>
      {/* <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          console.log(error);
          alert(`ERROR! ${error.message}`);
        }}
      /> */}
      <Hamburger />
    </nav>
  );
};
