import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const currentPath = req.nextUrl.pathname;

    // Direct role-based protection
    if (currentPath.startsWith("/dashboard/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (currentPath.startsWith("/dashboard/freelancer") && token?.role !== "freelancer") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (currentPath.startsWith("/dashboard/client") && token?.role !== "client") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
