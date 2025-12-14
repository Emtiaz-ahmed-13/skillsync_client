import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Extend the built-in session types with our custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
    accessToken?: string;
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    accessToken?: string;
  }
}

// Function to fetch user role from backend API
async function fetchUserRole(email: string): Promise<string | null> {
  try {
    // Try to fetch user from backend API
    const res = await fetch(
      `http://localhost:5001/api/v1/users?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      const result = await res.json();

      // If user exists, return their role
      if (result.data && result.data.length > 0) {
        const existingUser = result.data[0];
        return existingUser.role || null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Make API call to your backend
          const res = await fetch("http://localhost:5001/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const result = await res.json();

          // Extract user data from the response
          let userData = null;
          let accessToken = null;

          // Handle the nested structure from your logs
          if (
            result.data &&
            result.data.userWithoutPassword &&
            result.data.userWithoutPassword._doc
          ) {
            // Deeply nested structure: result.data.userWithoutPassword._doc
            userData = result.data.userWithoutPassword._doc;
            accessToken = result.data.accessToken;
          } else if (result.data && result.data.userWithoutPassword) {
            // Structure from your logs: result.data.userWithoutPassword
            userData = result.data.userWithoutPassword;
            accessToken = result.data.accessToken;
          } else if (result.data && result.data.user) {
            // Alternative structure: result.data.user
            userData = result.data.user;
            accessToken = result.data.accessToken;
          } else if (result.user) {
            // Direct user object
            userData = result.user;
            accessToken = result.accessToken;
          }

          if (userData) {
            const user: any = {
              id: userData._id || userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role || "client", // Default to client role
              accessToken: accessToken, // Store access token
            };

            return user;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // When signing in with OAuth providers
      if (account && user) {
        // For OAuth providers, we need to create/fetch user from backend
        if (account.type === "oauth") {
          try {
            // First, try to fetch the user's role from the backend
            if (user.email) {
              const userRole = await fetchUserRole(user.email);

              if (userRole) {
                // User exists in our database, use their role
                token.role = userRole;
              } else {
                // User doesn't exist, assign default role based on email heuristic
                // This follows the memory requirement for email-based heuristics
                if (user.email.includes("freelancer")) {
                  token.role = "freelancer";
                } else if (user.email.includes("admin")) {
                  token.role = "admin";
                } else {
                  token.role = "freelancer"; // CHANGED: Default to freelancer instead of client
                }

                // Create user in backend with assigned role
                const createUserRes = await fetch(
                  "http://localhost:5001/api/v1/auth/signup",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: user.name,
                      email: user.email,
                      role: token.role,
                      // Note: OAuth users won't have a password set initially
                    }),
                  }
                );

                if (!createUserRes.ok) {
                  console.error("Failed to create user in backend");
                }
              }
            }

            // Set basic user info
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;

            // For OAuth providers, we don't have an accessToken yet
            // But we'll get one when the user accesses protected resources
          } catch (error) {
            console.error("Error in OAuth callback:", error);
            // Fallback to basic user data with default role
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.role = "freelancer"; // CHANGED: Default to freelancer instead of client
          }
        } else {
          // For credentials provider
          token.id = (user as any).id;
          token.email = (user as any).email;
          token.name = (user as any).name;
          token.role = (user as any).role || "client";
          token.accessToken = (user as any).accessToken || token.accessToken;
        }
      } else if (user) {
        // For credentials provider (legacy)
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.role = (user as any).role || "client";
        token.accessToken = (user as any).accessToken || token.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as string) || "client";
        (session as any).accessToken = token.accessToken as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
