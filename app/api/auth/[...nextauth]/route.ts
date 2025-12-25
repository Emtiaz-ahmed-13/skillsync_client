import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: {
          label: "Role",
          type: "select",
          options: [
            { value: "client" },
            { value: "freelancer" },
            { value: "admin" },
          ],
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          // Call your backend API for authentication
          const response = await fetch(
            "http://localhost:5001/api/v1/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          console.log("Backend response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Backend response data:", data);

            // Handle different response formats
            let userData;
            if (data.user) {
              // Direct user object
              userData = data.user;
            } else if (data.data && data.data.userWithoutPassword) {
              // Nested user object (from your API format)
              userData = data.data.userWithoutPassword;
            } else if (data.data && data.data.user) {
              // Alternative nested format
              userData = data.data.user;
            }

            if (userData) {
              return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                // Include access token if available in the response
                accessToken: data.data?.accessToken,
              };
            } else {
              console.error("No user data found in response");
              return null;
            }
          } else {
            console.error("Backend login failed with status:", response.status);
            const errorData = await response.text();
            console.error("Backend error response:", errorData);
            return null;
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        // Create or update user in your backend
        try {
          const response = await fetch(
            "http://localhost:5001/api/v1/auth/google",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                provider: "google",
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            return {
              id: data.user?.id,
              name: data.user?.name,
              email: data.user?.email,
              role: data.user?.role || "client", // Default to client for social login
            };
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      async profile(profile) {
        // Create or update user in your backend
        try {
          const response = await fetch(
            "http://localhost:5001/api/v1/auth/github",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: profile.name,
                email: profile.email,
                image: profile.avatar_url,
                provider: "github",
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            return {
              id: data.user?.id,
              name: data.user?.name,
              email: data.user?.email,
              role: data.user?.role || "client", // Default to client for social login
            };
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // This callback is called after successful sign in
      // We can use this to redirect to the appropriate dashboard
      return true; // Allow sign in
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {};
      }
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Only allow relative URLs or URLs on the same origin
      try {
        // If it's a relative URL, allow it
        if (url.startsWith("/")) {
          // Prevent redirect loops by checking if URL contains auth paths
          if (url.includes("/auth/")) {
            return `${baseUrl}/dashboard`;
          }
          return `${baseUrl}${url}`;
        }

        // If it's an absolute URL, check if it's on the same origin
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === baseUrl) {
          return url;
        }
      } catch (error) {
        // If URL parsing fails, return to dashboard
        console.error("Redirect URL parsing error:", error);
      }

      // Default to dashboard to avoid redirect loops
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Export auth options separately for server-side use
export { authOptions };
