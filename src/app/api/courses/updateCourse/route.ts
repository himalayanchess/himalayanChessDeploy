import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Course from "@/models/CourseModel";
import { getFinalUpdatedChapters } from "@/helpers/updatestudent/finalUpdatedRecord";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    // check if another student with same name exists
    const existingCourse = await Course.findOne({
      name: { $regex: `^${reqBody?.name}$`, $options: "i" }, // Case-insensitive search
      _id: { $ne: reqBody?._id }, // Exclude the current student
    });
    if (existingCourse) {
      return NextResponse.json({
        msg: "Course already exists",
        statusCode: 409, // Conflict status
      });
    }

    const dbCourse = await Course.findOne({ _id: reqBody?._id });

    // Get the final updated chapters with active status handling
    let finalUpdatedChapters = getFinalUpdatedChapters(
      dbCourse?.chapters,
      reqBody?.chapters
    );

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: reqBody._id },
      { ...reqBody, chapters: finalUpdatedChapters },
      { new: true }
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
    return NextResponse.json({
      msg: "Internal error in updateCourse route",
      statusCode: 204,
      error,
    });
  }
}
