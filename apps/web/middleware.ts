import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (
    !token &&
    (pathname.startsWith("/documents") ||
      pathname.startsWith("/workspaces") ||
      pathname.startsWith("/search"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (token && ["/sign-in", "/sign-up", "/"].includes(pathname)) {
    return NextResponse.redirect(new URL("/documents", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/documents/:path*",
    "/workspaces/:path*",
    "/search/:path*",
  ],
};
