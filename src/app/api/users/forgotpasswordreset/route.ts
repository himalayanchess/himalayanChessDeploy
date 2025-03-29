import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const { email, newPassword } = await request.json();

    // Find user by userId
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        msg: "User not found",
        statusCode: 204,
      });
    }
    // Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword.toString(), salt);

    // Update password in database
    user.password = hashedPassword;
    const savedUser = await user.save();

    if (savedUser) {
      return NextResponse.json({
        msg: "Password changed",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Failed to change password ",
      statusCode: 204,
    });
  } catch (error: any) {
    console.error("Internal error in change password route", error);
    return NextResponse.json({
      msg: "Internal server error",
      statusCode: 204,
      error,
    });
  }
}
