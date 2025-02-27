import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Project from "@/models/ProjectModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allProjects = await Project.find({});
    if (allProjects) {
      return NextResponse.json({
        msg: "All projects found",
        statusCode: 200,
        allProjects,
      });
    }
    return NextResponse.json({
      msg: "All projects fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallProjects route", error);
    return NextResponse.json({
      msg: "Internal error in getallProjects",
      statusCode: 204,
      error,
    });
  }
}
