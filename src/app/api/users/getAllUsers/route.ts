import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allUsers = await User.find({}).select("-password ");
    if (allUsers) {
      return NextResponse.json({
        msg: "All users found",
        statusCode: 200,
        allUsers,
      });
    }
    return NextResponse.json({
      msg: "All users fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getAllUsers", error);
    return NextResponse.json({
      msg: "Internal error in getAllUsers route",
      error,
      statusCode: 204,
    });
  }
}
