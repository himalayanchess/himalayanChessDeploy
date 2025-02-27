import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import Course from "@/models/CourseModel";

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();
    console.log(reqBody);
    const courseExists = await Course.findOne({ name: reqBody.name });
    if (courseExists) {
      return NextResponse.json({
        statusCode: 204,
        msg: "Course already exists",
      });
    }
    const newcourse = new Course(reqBody);
    const savednewCourse = await newcourse.save();
    // new user added success
    if (savednewCourse) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New course added",
        savednewCourse,
      });
    }
    // user add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new course",
    });
  } catch (error) {
    console.log("Internal error in addcourse route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addcourse route",
      error,
    });
  }
}
