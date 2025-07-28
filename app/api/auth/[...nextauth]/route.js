import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/", // Redirect to your custom sign-in page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in MySQL
          const [existingUsers] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (existingUsers.length === 0) {
            // Create new user
            const userId = crypto.randomUUID();
            await db.execute(
              "INSERT INTO users (id, name, email, image, role, emailVerified) VALUES (?, ?, ?, ?, ?, NOW())",
              [userId, user.name, user.email, user.image, "student"]
            );
            user.id = userId;
          } else {
            user.id = existingUsers[0].id;
          }

          // Store or update account info
          const [existingAccounts] = await db.execute(
            "SELECT * FROM accounts WHERE provider = ? AND providerAccountId = ?",
            [account.provider, account.providerAccountId]
          );

          if (existingAccounts.length === 0) {
            await db.execute(
              "INSERT INTO accounts (id, userId, type, provider, providerAccountId, access_token, token_type, scope) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                crypto.randomUUID(),
                user.id,
                account.type,
                account.provider,
                account.providerAccountId,
                account.access_token,
                account.token_type,
                account.scope
              ]
            );
          }
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };