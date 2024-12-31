import { Landing } from "@/components/landing";
import { Navbar } from "@/components/navbar";

export const runtime = "edge";

export default function Page() {
  return (
    <main>
      <Navbar />
      <Landing />
    </main>
  );
}
