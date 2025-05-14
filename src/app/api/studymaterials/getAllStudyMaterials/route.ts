import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import StudyMaterial from "@/models/StudyMaterialsModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allStudyMaterials = await StudyMaterial.find({});
    if (allStudyMaterials) {
      return NextResponse.json({
        msg: "All Study Materials found",
        statusCode: 200,
        allStudyMaterials,
      });
    }
    return NextResponse.json({
      msg: "All Study Materials fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallStudyMaterials",
      statusCode: 204,
      error,
    });
  }
}
