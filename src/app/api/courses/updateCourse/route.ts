import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Course from "@/models/CourseModel";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: reqBody._id },
      reqBody
    );
    if (updatedCourse) {
      return NextResponse.json({
        msg: "Course updated",
        statusCode: 200,
        updatedCourse,
      });
    }
    return NextResponse.json({
      msg: "Course update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateCourse route", error);
    return NextResponse.json({
      msg: "Internal error in updateCourse route",
      statusCode: 204,
      error,
    });
  }
}
