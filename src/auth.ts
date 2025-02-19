import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: ({ email, password }) => {
        console.log(email, password);
        const user = {
          email: "cyrus@gmail.com",
          role: "Superadmin",
          name: "Cyrus",
        };
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "cyyy",
      options: {
        // httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        // secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
