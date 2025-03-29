import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { generateOTP } from "@/helpers/otp/generateOtp";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { email, otp } = reqBody;
    let userRecord = await User.findOne({ email });

    if (!userRecord) {
      return NextResponse.json({
        msg: "No user with this email",
        statusCode: 204,
      });
    }

    // Compare the OTP using bcrypt
    const isOtpValid = await bcrypt.compare(
      otp.toString(),
      userRecord.forgotPasswordOtp
    );

    if (!isOtpValid) {
      return NextResponse.json({ msg: "Invalid OTP", statusCode: 204 });
    }

    // Check if OTP has expired
    // expires < currentime (invalid)
    if (
      new Date(userRecord?.forgotPasswordExpires)?.getTime() <
      new Date().getTime()
    ) {
      return NextResponse.json({ msg: "OTP has expired", statusCode: 204 });
    }

    return NextResponse.json({
      msg: "Valid OTP",
      statusCode: 200,
    });
  } catch (error) {
    console.log("Internal error in getUser route", error);
    return NextResponse.json({
      msg: "Internal error in getUser",
      statusCode: 204,
      error,
    });
  }
}
