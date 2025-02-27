import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/index";
import bcryptjs from "bcryptjs";
import User from "@/models/UserModel";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { randomPassword, userId } = reqBody;
    // hash the password using bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(randomPassword, salt);
    const resetUser = await User.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword }
    );
    if (resetUser) {
      return NextResponse.json({
        msg: "Password reset success",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Failed to reset password",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in resetPassword route", error);
    return NextResponse.json({
      msg: "Internal error in resetPassword route",
      statusCode: 204,
    });
  }
}
