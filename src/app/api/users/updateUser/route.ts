import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // console.log("updateuser route", reqBody);
    const { email, password, ...updateFields } = reqBody;

    const updatedUser = await User.findOneAndUpdate(
      { _id: reqBody._id },
      updateFields
    );
    if (updatedUser) {
      return NextResponse.json({
        msg: "User updated",
        statusCode: 200,
        updatedUser,
      });
    }
    return NextResponse.json({
      msg: "User update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateUser route", error);
    return NextResponse.json({
      msg: "Internal error in updateUser route",
      statusCode: 204,
      error,
    });
  }
}
