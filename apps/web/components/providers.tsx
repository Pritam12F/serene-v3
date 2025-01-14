"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <NextUIProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={false}
          disableTransitionOnChange
          enableColorScheme
        >
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </ClerkProvider>
  );
}
