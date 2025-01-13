import Footer from "@/components/footer";
import { Landing } from "@/components/landing";
import Navbar from "@/components/navbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main>
        <Landing />
      </main>
      <Footer />
    </div>
  );
}
