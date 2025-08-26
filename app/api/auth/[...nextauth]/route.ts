import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import sql from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) {
          return false;
        }

        const name = user.name || "";
        const email = user.email;
        const image = user.image || "";

        const existingUser =
          await sql`SELECT id FROM users WHERE email = ${email}`;

        if (existingUser.length === 0) {
          await sql`
            INSERT INTO users (name, email, image, created_at, updated_at) 
            VALUES (${name}, ${email}, ${image}, NOW(), NOW())
          `;
        } else {
          await sql`
            UPDATE users 
            SET name = ${name}, image = ${image}, updated_at = NOW() 
            WHERE email = ${email}
          `;
        }

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const userData =
          await sql`SELECT id, role FROM users WHERE email = ${user.email}`;
        console.log(userData);
        if (userData.length > 0) {
          token.userId = userData[0].id;
          token.userRole = userData[0].role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId ?? "";
        session.user.role = token.userRole ?? "learner";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      if (new URL(url).origin === baseUrl) return url;

      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
