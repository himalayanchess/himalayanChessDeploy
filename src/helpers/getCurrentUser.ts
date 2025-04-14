// lib/auth.ts
import { auth } from "@/auth";

export async function getCurrentUser() {
  console.log("indise get curent user start");

  const session = await auth();
  console.log("get current user res", session);

  if (!session?.user) {
    return null;
  }

  return session;
}
