import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl.pathname;

  if (
    token &&
    (url.startsWith("/sign-in") ||
      url.startsWith("/sign-up") ||
      url.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/documents", request.url));
  }

  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/documents/:path*"],
};
