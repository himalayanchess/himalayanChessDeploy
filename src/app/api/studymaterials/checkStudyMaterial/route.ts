import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import StudyMaterial from "@/models/StudyMaterialsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { fileName } = reqBody;

    if (!fileName) {
      return NextResponse.json({
        msg: "FileName are required",
        statusCode: 400,
      });
    }

    const fileNameExists = await StudyMaterial.findOne({
      fileName: { $regex: new RegExp(`^${fileName}$`, "i") },
    });

    if (!fileNameExists) {
      return NextResponse.json({
        msg: "Unique file name (ok)",
        statusCode: 200,
      });
    }

    return NextResponse.json({
      msg: "File name exists",
      statusCode: 204, // conflict
    });
  } catch (error) {
    console.error("Error in checkStudyMaterialName route:", error);
    return NextResponse.json({
      msg: "Internal server error",
      statusCode: 204,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
