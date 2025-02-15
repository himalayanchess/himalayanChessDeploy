import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();
    console.log(reqBody);
    const newUser = new User(reqBody);
    const savedNewUser = await newUser.save();
    // new user added success
    if (savedNewUser) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New user added",
      });
    }
    // user add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new user",
    });
  } catch (error) {
    console.log("Internal error in addNewUser route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewUser route",
      error,
    });
  }
}
