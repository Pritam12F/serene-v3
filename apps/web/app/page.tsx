import { Landing } from "@/components/landing";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/documents");
  }

  return (
    <main>
      <Landing />
    </main>
  );
}
