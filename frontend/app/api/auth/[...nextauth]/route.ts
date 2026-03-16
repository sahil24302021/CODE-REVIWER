import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authOptions = {
  providers: [
    // 1. Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    // 2. GitHub OAuth
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // 3. Username/Password (Connecting to your Render Backend)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            }),
            headers: { "Content-Type": "application/json" }
          });
          
          const data = await res.json();

          if (res.ok && data.user) {
            // Include backend generated JWT token
            return { 
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.avatarUrl,
              accessToken: data.token 
            };
          }
          return null;
        } catch (error) {
          console.error("Login authorization error", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      // Initial sign-in
      if (user && account) {
        token.id = user.id;

        if (account.provider === "credentials") {
          // Credentials login: we already have the backend JWT
          token.accessToken = user.accessToken;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
        } else if (account.provider === "github") {
          // GitHub OAuth: sync user to backend and get JWT
          try {
            const res = await fetch(`${API_BASE}/auth/github`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                githubId: profile?.id || account.providerAccountId,
                email: user.email || profile?.email,
                name: user.name || profile?.login || profile?.name,
                avatarUrl: user.image || profile?.avatar_url,
              }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
              token.accessToken = data.token;
              token.id = data.user.id;
            }
          } catch (err) {
            console.error("GitHub backend sync failed:", err);
          }
        } else if (account.provider === "google") {
          // Google OAuth: sync user to backend and get JWT
          try {
            const res = await fetch(`${API_BASE}/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                avatarUrl: user.image,
              }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
              token.accessToken = data.token;
              token.id = data.user.id;
            }
          } catch (err) {
            console.error("Google backend sync failed:", err);
          }
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      session.accessToken = token.accessToken as string;
      return session;
    }
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
