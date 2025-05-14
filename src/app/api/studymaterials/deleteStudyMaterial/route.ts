import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import StudyMaterial from "@/models/StudyMaterialsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedStudyMaterial = await StudyMaterial.findByIdAndUpdate(
      { _id: reqBody.studyMaterialId },
      { activeStatus: false }
    );
    if (deletedStudyMaterial) {
      return NextResponse.json({
        msg: "Study Material Deleted",
        statusCode: 200,
      });
    }

    return NextResponse.json({
      msg: "Study Material delete failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteStudy Material route",
      statusCode: 204,
      error,
    });
  }
}
