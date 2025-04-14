import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { signIn } from "next-auth/react";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const fetchedUser = await User.findOne({ email });
    // console.log(
    //   "asdfashdfp asjdfpkasdf;lasjdf[o",
    //   email,
    //   password,
    //   fetchedUser
    // );

    // user not found
    if (!fetchedUser) {
      return NextResponse.json({
        msg: "User not found",
        statusCode: 204,
      });
    }
    // inactive user
    if (!fetchedUser.activeStatus) {
      return NextResponse.json({
        msg: "User is inactive",
        statusCode: 204,
      });
    }
    // passsword check
    const passMatch = await bcryptjs.compare(
      String(password),
      fetchedUser.password
    );

    if (!passMatch) {
      return NextResponse.json({
        msg: "Incorrect password",
        statusCode: 204,
      });
    }
    // still need to signin using next-auth/react after successfull response
    return NextResponse.json({
      msg: "Login success",
      statusCode: 200,
      fetchedUser
    });
  } catch (error) {
    console.log("Internal error in login route", error);
    return NextResponse.json({
      msg: "Internal error in login route",
      statusCode: 204,
    });
  }
}
