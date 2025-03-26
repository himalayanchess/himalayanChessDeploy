import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Course from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let courseRecord = await Course.findById(reqBody?.courseId);

    if (courseRecord) {
      return NextResponse.json({
        msg: "Course found",
        statusCode: 200,
        courseRecord,
      });
    }
    console.log(courseRecord);

    return NextResponse.json({
      msg: "Course not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getCourse route", error);
    return NextResponse.json({
      msg: "Internal error in getCourse",
      statusCode: 204,
      error,
    });
  }
}
