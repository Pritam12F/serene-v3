import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export const Footer = () => {
  return (
    <div className="flex py-3 w-full justify-between bg-neutral-100 dark:bg-gray9-400">
      <img src="./image2.jpg" className="h-16 w-h-16 rounded-sm mx-4" />
      <div className="flex px-4 min-[430px]:space-x-8 min-[500px]:space-x-16 sm:space-x-32 sm:mx-5 md:space-x-48 lg:space-x-72 lg:mx-20">
        <div className="flex flex-col">
          <h3 className="font-semibold ml-4">Useful links</h3>
          <div className="flex flex-col items-start -space-y-1.5">
            <Button variant={"link"}>Github</Button>
            <Button variant={"link"}>Terms & Conditions</Button>
            <Button variant={"link"}>Privacy Policy</Button>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold">Follow us</h3>
          <div className="flex space-x-4 lg:space-x-8 mt-2">
            <Link href={"#"}>
              <FaDiscord className="w-5 h-5" />
            </Link>
            <Link href={"https://github.com/Pritam12F"}>
              <FaGithub className="w-5 h-5" />
            </Link>
            <Link href={"https://twitter.com/pritam121f"}>
              <FaTwitter className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
