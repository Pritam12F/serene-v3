import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
