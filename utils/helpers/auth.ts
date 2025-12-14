import { handleApiError, isResponseOk, parseJsonResponse } from "./api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

/**
 * Get access token from NextAuth session
 * This is a helper to extract token from the session
 */
export function getAccessTokenFromSession(session: any): string | null {
  // The token should be stored in the session after login
  if (session?.accessToken) {
    return session.accessToken;
  }

  // Fallback: check if stored in user object
  if (session?.user?.accessToken) {
    return session.user.accessToken;
  }

  // Additional fallback: check for jwt token in session
  if (session?.user?.jwt) {
    return session.user.jwt;
  }

  // Additional fallback: check for data.accessToken
  if (session?.data?.accessToken) {
    return session.data.accessToken;
  }

  // For OAuth users who don't have a token yet, check localStorage
  const localStorageToken = localStorage.getItem("accessToken");
  if (localStorageToken) {
    return localStorageToken;
  }

  return null;
}

/**
 * Login and get access token
 * Note: This is handled by NextAuth, but keeping for reference
 */
export async function loginUser(email: string, password: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await parseJsonResponse(response);

    if (isResponseOk(response) && result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Login failed");
    }
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
}
