import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const { userId, currentPassword, newPassword } = await request.json();

    // Find user by userId
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({
        msg: "User not found",
        statusCode: 204,
      });
    }

    // Compare currentPassword with stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return NextResponse.json({
        msg: "Current password is incorrect",
        statusCode: 204,
      });
    }

    // Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      msg: "Password changed ",
      statusCode: 200,
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
