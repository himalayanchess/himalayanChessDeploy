import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Project from "@/models/ProjectModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let projectRecord = await Project.findById(reqBody?.projectId);

    if (projectRecord) {
      return NextResponse.json({
        msg: "Project found",
        statusCode: 200,
        projectRecord,
      });
    }
    console.log(projectRecord);

    return NextResponse.json({
      msg: "Project not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getProject route", error);
    return NextResponse.json({
      msg: "Internal error in getProject",
      statusCode: 204,
      error,
    });
  }
}
