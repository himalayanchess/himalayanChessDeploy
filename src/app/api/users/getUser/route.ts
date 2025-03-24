import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let userRecord = await User.findById(reqBody?.userId).select("-password ");

    if (userRecord) {
      return NextResponse.json({
        msg: "User found",
        statusCode: 200,
        userRecord,
      });
    }
    console.log(userRecord);

    return NextResponse.json({
      msg: "User not found",
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
