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
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // Added role to credentials
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
            console.log("Backend API call failed with status:", res.status);
            return null;
          }

          const result = await res.json();
          console.log("Backend response:", JSON.stringify(result, null, 2));

          // Extract user data from the response
          let userData = null;

          // Handle the nested structure from your logs
          if (
            result.data &&
            result.data.userWithoutPassword &&
            result.data.userWithoutPassword._doc
          ) {
            // Deeply nested structure: result.data.userWithoutPassword._doc
            userData = result.data.userWithoutPassword._doc;
          } else if (result.data && result.data.userWithoutPassword) {
            // Structure from your logs: result.data.userWithoutPassword
            userData = result.data.userWithoutPassword;
          } else if (result.data && result.data.user) {
            // Alternative structure: result.data.user
            userData = result.data.user;
          } else if (result.user) {
            // Direct user object
            userData = result.user;
          }

          if (userData) {
            const user: any = {
              id: userData._id || userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role || "client", // Default to client role
            };

            // If role is provided in credentials, use it
            if (credentials.role) {
              user.role = credentials.role;
            }

            console.log("Authorize - returning user:", user);
            return user;
          } else {
            console.log("Could not extract user data from response");
            return null;
          }
        } catch (error) {
          console.error("Authorization error:", error);
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
      console.log("JWT callback called with:", { token, user, account });

      // When signing in with OAuth providers
      if (account && user) {
        // For OAuth providers, we need to create/fetch user from backend
        if (account.type === "oauth") {
          try {
            // Check if user exists in our database
            const res = await fetch(
              `http://localhost:5001/api/v1/users?email=${user.email}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );

            if (res.ok) {
              const result = await res.json();
              console.log("User lookup result:", result);

              // If user exists, return their data with client role
              if (result.data && result.data.length > 0) {
                const existingUser = result.data[0];
                token.id = existingUser._id || existingUser.id;
                token.email = existingUser.email;
                token.name = existingUser.name;
                token.role = existingUser.role || "client";
              } else {
                // If user doesn't exist, create them with client role
                const createUserRes = await fetch(
                  "http://localhost:5001/api/v1/auth/signup",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: user.name,
                      email: user.email,
                      role: "client", // Default to client role for OAuth users
                      // Note: OAuth users won't have a password set initially
                    }),
                  }
                );

                if (createUserRes.ok) {
                  const createUserResult = await createUserRes.json();
                  console.log("Created new OAuth user:", createUserResult);

                  if (createUserResult.data && createUserResult.data.user) {
                    token.id =
                      createUserResult.data.user._id ||
                      createUserResult.data.user.id;
                    token.email = createUserResult.data.user.email;
                    token.name = createUserResult.data.user.name;
                    token.role = createUserResult.data.user.role || "client";
                  }
                } else {
                  console.error(
                    "Failed to create OAuth user:",
                    await createUserRes.text()
                  );
                  // Fallback to basic user data
                  token.id = user.id;
                  token.email = user.email;
                  token.name = user.name;
                  token.role = "client"; // Default to client role
                }
              }
            } else {
              // Fallback if user lookup fails
              token.id = user.id;
              token.email = user.email;
              token.name = user.name;
              token.role = "client"; // Default to client role
            }
          } catch (error) {
            console.error("Error in OAuth user handling:", error);
            // Fallback to basic user data
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.role = "client"; // Default to client role
          }
        } else {
          // For credentials provider
          token.id = (user as any).id;
          token.email = (user as any).email;
          token.name = (user as any).name;
          token.role = (user as any).role || "client";
        }

        console.log("JWT callback - token after assignment:", token);
      } else if (user) {
        // For credentials provider (legacy)
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.role = (user as any).role || "client";

        console.log("JWT callback - user:", user);
        console.log("JWT callback - token after assignment:", token);
      } else {
        console.log("JWT callback - no user or account provided");
      }

      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      console.log("Session callback - session before:", session);

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as string) || "client"; // Default to client role
      }

      console.log("Session callback - session after:", session);
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
