import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  console.log("route getloggedinuser ", session);
  return NextResponse.json({ msg: "getloggedinuer route", session });
}
