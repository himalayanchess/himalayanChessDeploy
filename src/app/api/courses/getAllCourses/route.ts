import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Course from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allCourses = await Course.find({});
    if (allCourses) {
      return NextResponse.json({
        msg: "All courses found",
        statusCode: 200,
        allCourses,
      });
    }
    return NextResponse.json({
      msg: "All courses fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getAllCourses route", error);
    return NextResponse.json({
      msg: "Internal error in getAllCourses",
      statusCode: 204,
      error,
    });
  }
}
