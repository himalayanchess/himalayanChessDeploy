import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { sendOtpMail } from "@/helpers/nodemailer/nodemailer";
import { generateOTP } from "@/helpers/otp/generateOtp";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let userRecord = await User.findOne({ email: reqBody?.email });

    if (!userRecord) {
      return NextResponse.json({
        msg: "No user with this email",
        statusCode: 204,
      });
    }

    // create otp hash it and store it in users db
    // this function return string of 6 digits
    // bcrypt only accept string not numbers
    const generatedOtp = generateOTP(6);

    sendOtpMail({ email: reqBody?.email, otp: generatedOtp });

    console.log("generated otp", generatedOtp);

    // hash otp
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(generatedOtp.toString(), salt);

    const otpExpiry = new Date().getTime() + 2 * 60 * 1000;

    userRecord.forgotPasswordOtp = hashedOTP;
    userRecord.forgotPasswordExpires = otpExpiry;

    const savedUser = await userRecord.save();
    if (savedUser) {
      return NextResponse.json({
        msg: "OTP sent to email",
        statusCode: 200,
      });
    }

    return NextResponse.json({
      msg: "Failed to send otp",
      statusCode: 204,
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
