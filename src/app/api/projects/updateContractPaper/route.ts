import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Project from "@/models/ProjectModel";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { initialData, updatedContractPaper } = reqBody;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: initialData._id },
      { contractPaper: updatedContractPaper }
    );
    if (updatedProject) {
      return NextResponse.json({
        msg: "Contract paper updated",
        statusCode: 200,
        updatedProject,
      });
    }
    return NextResponse.json({
      msg: "Contarct paper update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updatecontractpaper route", error);
    return NextResponse.json({
      msg: "Internal error in updatecontractpaper route",
      statusCode: 204,
      error,
    });
  }
}
