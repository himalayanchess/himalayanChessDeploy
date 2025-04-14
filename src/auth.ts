import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialProvider from "next-auth/providers/credentials";
import { dbconnect } from "./helpers/dbconnect/dbconnect";
import User from "./models/UserModel";
import bcryptjs from "bcryptjs";
import axios from "axios";
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
      authorize: async ({ email, password }): Promise<any> => {
        console.log("starting authorize in auth");

        const { data: resData } = await axios.post(
          `${process.env.NEXTAUTH_URL}/api/users/login`,
          {
            email,
            password,
          }
        );

        // console.log("authorzie resdata of login", resData);
        if (resData?.statusCode != 200) {
          throw new Error(resData?.msg);
        }

        const user = {
          _id: resData?.fetchedUser._id,
          name: resData?.fetchedUser.name,
          role: resData?.fetchedUser.role,
        };
        // console.log("authorzie user final", user);
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "myToken",
      options: {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
