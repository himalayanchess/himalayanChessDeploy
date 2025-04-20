import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    isGlobalAdmin: any;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      imageUrl?: string;
      role?: string;
      isGlobalAdmin: any;
    } & DefaultSession["user"];
  }
}
