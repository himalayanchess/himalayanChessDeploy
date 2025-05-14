import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { todaysClassId, fileName } = reqBody;

    //appen study material
    const fileNameExists = await ActivityRecord.findOne({
      _id: todaysClassId,
      studyMaterials: {
        $elemMatch: {
          fileName: { $regex: new RegExp(`^${fileName}$`, "i") },
        },
      },
    });

    if (!fileNameExists) {
      return NextResponse.json({
        msg: "Unique file name (ok)",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "File name exists",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in checkStudyMaterialName route",
      statusCode: 204,
      error,
    });
  }
}
