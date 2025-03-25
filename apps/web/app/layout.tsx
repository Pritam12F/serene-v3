import { Inter } from "next/font/google";
import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Toaster } from "@workspace/ui/components/sonner";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-ui/styles/dark/media-query.css";
import "@workspace/ui/globals.css";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontInter.variable} font-sans antialiased min-h-screen`}
      >
        <Providers>
          {children}
          <Toaster closeButton />
        </Providers>
      </body>
    </html>
  );
}
