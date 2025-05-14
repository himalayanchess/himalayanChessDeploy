import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();

    const allAdminUsers = await User.find({ role: "Admin" }).select(
      "-password "
    );

    if (allAdminUsers) {
      return NextResponse.json({
        msg: "All admin users found",
        statusCode: 200,
        allAdminUsers,
      });
    }
    return NextResponse.json({
      msg: "All admin users fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallAdminUsers route",
      error,
      statusCode: 204,
    });
  }
}
