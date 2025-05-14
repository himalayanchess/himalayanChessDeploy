import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Project from "@/models/ProjectModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedProject = await Project.findByIdAndUpdate(
      { _id: reqBody.projectId },
      { activeStatus: false }
    );
    if (deletedProject) {
      return NextResponse.json({
        msg: "Project deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Project failed to delete",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteProject route",
      statusCode: 204,
      error,
    });
  }
}
