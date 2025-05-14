import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import Course from "@/models/CourseModel";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.formData();

    const file = reqBody.get("file") as File;
    // Read the file content using Buffer
    const fileBuffer = await file.arrayBuffer(); // Convert the file to ArrayBuffer
    const fileContent = Buffer.from(fileBuffer).toString("utf-8"); // Convert ArrayBuffer to string (utf-8)

    // Parse the content as JSON
    const parsedCourseData = JSON.parse(fileContent);

    const {
      affiliatedTo = "",
      name = "",
      duration = 12,
      nextCourseName = "",
      chapters = [],
    } = parsedCourseData;

    if (!affiliatedTo || !name || !duration || !nextCourseName || !chapters) {
      return NextResponse.json({
        msg: "Mandatory fields not satisfied",
        statusCode: 204,
      });
    }

    const courseExists = await Course.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (courseExists) {
      return NextResponse.json({
        statusCode: 204,
        msg: "Course already exists",
      });
    }
    const newcourse = new Course({
      affiliatedTo,
      name,
      duration,
      nextCourseName,
      chapters,
    });
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
    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addcourse route",
      error,
    });
  }
}
