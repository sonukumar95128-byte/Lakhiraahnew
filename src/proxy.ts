import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const authed = request.cookies.get(ADMIN_COOKIE)?.value === "1";
    if (!authed) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
