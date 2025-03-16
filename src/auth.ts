import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialProvider from "next-auth/providers/credentials";
import { dbconnect } from "./helpers/dbconnect/dbconnect";
import User from "./models/UserModel";
import bcryptjs from "bcryptjs";
import { fetchExternalImage } from "next/dist/server/image-optimizer";
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
      authorize: async ({ email, password }) => {
        await dbconnect();

        const fetchedUser = await User.findOne({ email });
        // checks are done in login route (repeated here) was giving response as configuartin,200
        // // Check if user exists
        if (!fetchedUser) {
          throw new Error("User not found");
        }
        console.log("asasd", fetchedUser);

        //check users activeStatus
        if (!fetchedUser?.activeStatus) {
          console.log("inactiveeeeeeeee");

          throw new Error("User is inactive");
        }
        // // Check password match
        const passMatch = await bcryptjs.compare(
          String(password),
          fetchedUser.password
        );

        if (!passMatch) {
          throw new Error("Incorrect password");
        }

        const user = {
          _id: fetchedUser._id,
          name: fetchedUser.name,
          role: fetchedUser.role,
        };
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
        // httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        // secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
