import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  }
  interface Session {
    user: {
      _id?: string;
      name?: string;
      email?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}
