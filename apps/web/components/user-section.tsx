import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ChevronsLeft, Plus } from "lucide-react";
import { redirect } from "next/navigation";

export const UserSection = async () => {
  const user = await currentUser();

  if (!user) redirect("/");

  return (
    <section className="flex justify-between items-center">
      <div className="flex justify-center items-center">
        <UserButton />
        <div>{user.firstName}</div>
      </div>
      <div className="flex items-center">
        <ChevronsLeft className="w-7 h-7" />
        <Plus />
      </div>
    </section>
  );
};
