import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { SignedOut } from "@clerk/nextjs";
import Footer from "@/components/footer";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950`}
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
