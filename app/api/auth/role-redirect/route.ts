import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // If no session, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Get the user role from session
  const userRole = session.user.role;

  let redirectUrl = "/dashboard"; // default

  // Determine redirect URL based on user role
  switch (userRole) {
    case "freelancer":
      redirectUrl = "/dashboard/freelancer";
      break;
    case "client":
      redirectUrl = "/dashboard/client";
      break;
    case "admin":
      redirectUrl = "/dashboard/admin";
      break;
    default:
      redirectUrl = "/dashboard";
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
