import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

async function syncGitHubUser(profile: {
  email: string;
  name: string;
  avatar?: string;
  githubId: string;
}) {
  const response = await fetch(`${API_URL}/auth/github`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const user = data.data?.user || data.data?.userWithoutPassword;
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken: data.data?.accessToken,
  };
}

const providers: any[] = [
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
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const userData =
            data.data?.userWithoutPassword || data.data?.user || data.user;

          if (userData) {
            return {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              accessToken: data.data?.accessToken,
            };
          }
        }
        return null;
      } catch {
        return null;
      }
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

export const authOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "github") {
        const email =
          user.email ||
          (profile as { email?: string })?.email ||
          (profile as { emails?: { email: string }[] })?.emails?.[0]?.email;

        if (!email) {
          return "/auth/login?error=GitHubEmailRequired";
        }

        const synced = await syncGitHubUser({
          email,
          name: user.name || (profile as { name?: string })?.name || "GitHub User",
          avatar: user.image || undefined,
          githubId: account.providerAccountId,
        });

        if (!synced) {
          return false;
        }

        user.id = synced.id;
        user.role = synced.role;
        user.accessToken = synced.accessToken;
        user.email = synced.email;
        return true;
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (!session.user) session.user = {};
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) {
        if (url.includes("/auth/") && !url.includes("role-redirect")) {
          return `${baseUrl}/dashboard`;
        }
        return `${baseUrl}${url}`;
      }
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* ignore */
      }
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
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
