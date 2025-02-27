import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/ProjectModel";

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();
    console.log(reqBody);
    const newProject = new Project(reqBody);
    const savednewProject = await newProject.save();
    // new user added success
    if (savednewProject) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New project added",
        savednewProject,
      });
    }
    // user add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new project",
    });
  } catch (error) {
    console.log("Internal error in addnewProject route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewProject route",
      error,
    });
  }
}
