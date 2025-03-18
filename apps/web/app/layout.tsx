import { Inter } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@workspace/ui/components/sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Serene",
  description: "Created by Pritam",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontInter.variable} font-sans antialiased min-h-screen`}
      >
        <Providers>
          {!isAuthenticated && <Navbar />}
          {children}
          {!isAuthenticated && <Footer />}
          <Toaster closeButton />
        </Providers>
      </body>
    </html>
  );
}
