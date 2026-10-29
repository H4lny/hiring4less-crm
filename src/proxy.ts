import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "h4l_session";
const PUBLIC_PATHS = ["/login", "/share"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/api/share/");

  if (isPublic) return NextResponse.next();

  const hasCookie = request.cookies.has(COOKIE_NAME);
  if (!hasCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next internals)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
