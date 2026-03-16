import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
      async authorize(credentials, req) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
            return { ...data.user, accessToken: data.token };
          }
          // Return null if login fails
          return null;
        } catch (error) {
          console.error("Login authorization error", error);
          return null;
        }
      }
    })
  ],
  // Sync the external tokens back to the user session
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken || account?.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      session.accessToken = token.accessToken as string;
      return session;
    }
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: '/login', // Will override NextAuth default pages to use yours
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
