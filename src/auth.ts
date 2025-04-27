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
        };

        // login record info
        // Get IP address and user agent from the request
        let ipAddress = req.headers["x-forwarded-for"]
          ? req.headers["x-forwarded-for"].split(",")[0] // Take the first IP if multiple proxies are involved
          : req.connection?.remoteAddress; // Fallback to connection.remoteAddress

        // If the IP is ::1 or 127.0.0.1 (local addresses), handle it as localhost
        if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
          ipAddress = "localhost";
        }

        const userAgent = req.headers["user-agent"] || "it says undefined`";

        // Attempt to get location using the IP address
        let latitude = null;
        let longitude = null;

        try {
          const geoResponse = await axios.get(
            `https://ipapi.co/${ipAddress}/json/`
          );
          const { latitude: geoLat, longitude: geoLon } = geoResponse.data;
          latitude = geoLat || null;
          longitude = geoLon || null;
        } catch (error) {
          console.log("Error fetching geolocation", error);
        }

        // Log login record
        try {
          const { data: resData } = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/loginrecord/addNewLoginRecord`, // Full URL
            {
              userId: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              branchName: user.branchName,
              branchId: user.branchId,
              isGlobalAdmin: user.isGlobalAdmin,
              ipAddress,
              userAgent,
              timeZone: req.headers["timezone"] || "UTC", // Default to UTC if no timezone provided
              latitude,
              longitude,
            }
          );
          if (resData?.statusCode == 200) {
            console.log("Login record added");
          }
          console.log("Failed to add record ");
        } catch (error) {
          console.log("Error while saving login record in db", error);
        }

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
