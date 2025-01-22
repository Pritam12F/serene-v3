import { Inter } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { SignedOut } from "@clerk/nextjs";
import Footer from "@/components/footer";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Serene",
  description: "Created by Pritam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontInter.variable} font-sans antialiased min-h-screen`}
      >
        <Providers>
          <SignedOut>
            <Navbar />
          </SignedOut>
          {children}
          <SignedOut>
            <Footer />
          </SignedOut>
        </Providers>
      </body>
    </html>
  );
}
