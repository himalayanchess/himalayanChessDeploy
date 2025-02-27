import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let allUsers = [];

    // if (reqBody.role?.toLowerCase() == "superadmin") {
    //   allUsers = await User.find({});
    // } else {
    //   allUsers = await User.find({}).select("-password ");
    // }
    allUsers = await User.find({}).select("-password ");

    // console.log("all users", allUsers);

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
