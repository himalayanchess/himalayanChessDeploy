import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialProvider from "next-auth/providers/credentials";
import { dbconnect } from "./helpers/dbconnect/dbconnect";
import User from "./models/UserModel";
import bcryptjs from "bcryptjs";
import axios from "axios";
import LoginRecord from "./models/LoginRecordModel";

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
      authorize: async ({ email, password }, req: any): Promise<any> => {
        console.log("starting authorize in auth (req)", req);

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
          email: resData?.fetchedUser.email,
          isGlobalAdmin: resData?.fetchedUser.isGlobalAdmin || false,
          branchName: resData?.fetchedUser.branchName || "",
          branchId: resData?.fetchedUser.branchId || "",
          imageUrl: resData?.fetchedUser.imageUrl || "",
        };

        // user for token now
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
        token.email = user.email;
        token.isGlobalAdmin = user.isGlobalAdmin;
        token.branchName = user.branchName;
        token.branchId = user.branchId;
        token.imageUrl = user.imageUrl;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.isGlobalAdmin = token.isGlobalAdmin;
        session.user.branchName = token.branchName;
        session.user.branchId = token.branchId;
        session.user.imageUrl = token.imageUrl;
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
        sameSite: "strict",
        maxAge: 600, // 10 minutes in seconds
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 600, // 10 minutes in seconds
    updateAge: 600, // Update session only after 10 minutes
  },
  jwt: {
    maxAge: 600, // 10 minutes in seconds
  },
});
