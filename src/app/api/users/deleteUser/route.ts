import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedUser = await User.findByIdAndUpdate(
      { _id: reqBody.userId },
      { activeStatus: false }
    );

    if (deletedUser) {
      return NextResponse.json({
        msg: "User deleted",
        statusCode: 200,
      });
    }

    return NextResponse.json({
      msg: "User delete failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteUser route",
      statusCode: 204,
      error,
    });
  }
}
