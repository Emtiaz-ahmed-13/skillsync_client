import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Get the user's role from the token
    const token = req.nextauth.token;
    const currentPath = req.nextUrl.pathname;

    // If user is accessing a role-specific dashboard
    if (currentPath.startsWith("/dashboard/admin")) {
      if (token?.role !== "admin") {
        // Redirect non-admins trying to access admin dashboard
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } else if (currentPath.startsWith("/dashboard/freelancer")) {
      if (token?.role !== "freelancer") {
        // Redirect non-freelancers trying to access freelancer dashboard
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } else if (currentPath.startsWith("/dashboard/client")) {
      if (token?.role !== "client") {
        // Redirect non-clients trying to access client dashboard
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // User must be authenticated to access any dashboard
        return !!token;
      },
    },
  }
);

// Define which paths the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*"],
};
