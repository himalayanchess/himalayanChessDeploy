import { dbconnect } from "@/index";
import { NextAuthOptions } from "next-auth";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/UserModel";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await dbconnect();
          const { email, password } = credentials;
          console.log("creds", credentials);

          const userCheck = await UserModel.findOne({ email });
          if (!userCheck) {
            throw new Error("Invalid user");
          }
          //   const hashedCorrect = await bcryptjs.compare(
          //     password,
          //     userCheck.password
          //   );
          const hashedCorrect = password == userCheck.password;
          if (!hashedCorrect) {
            throw new Error("Incorrect password");
          }
          const user = {
            _id: userCheck._id,
            name: userCheck.name,
            email: userCheck.email,
            role: userCheck.role,
          };
          return user;
        } catch (e: any) {
          console.log("errr", e);

          throw new Error(e.message || "Internal Error: next-authorize");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  cookies: {
    sessionToken: {
      name: "nextjs.session-token",
      options: {
        // httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        // secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
  },
};
