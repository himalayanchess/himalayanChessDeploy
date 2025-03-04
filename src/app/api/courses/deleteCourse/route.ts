import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Course from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedCourse = await Course.findByIdAndUpdate(
      { _id: reqBody.courseId },
      { activeStatus: false }
    );
    if (deletedCourse) {
      return NextResponse.json({
        msg: "Course deleted",
        statusCode: 200,
      });
    }

    return NextResponse.json({
      msg: "Course delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in deleteCourse route", error);
    return NextResponse.json({
      msg: "Internal error in deleteCourse route",
      statusCode: 204,
      error,
    });
  }
}
