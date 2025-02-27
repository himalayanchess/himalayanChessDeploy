import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Project from "@/models/ProjectModel";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    const updatedProject = await Project.findOneAndUpdate(
      { _id: reqBody._id },
      reqBody
    );
    if (updatedProject) {
      return NextResponse.json({
        msg: "Project updated",
        statusCode: 200,
        updatedProject,
      });
    }
    return NextResponse.json({
      msg: "Project update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateProject route", error);
    return NextResponse.json({
      msg: "Internal error in updateProject route",
      statusCode: 204,
      error,
    });
  }
}
