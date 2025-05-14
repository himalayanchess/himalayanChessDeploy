import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import Batch from "@/models/BatchModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { selectedTodaysClass, studyMaterial } = reqBody;
    const updatedRecord = await ActivityRecord.findOneAndUpdate(
      {
        _id: selectedTodaysClass?._id,
        "studyMaterials.fileName": studyMaterial?.fileName,
        "studyMaterials.uploadedAt": studyMaterial?.uploadedAt,
      },
      {
        $set: { "studyMaterials.$.activeStatus": false }, // Update only matched item
      },
      { new: true }
    );
    if (updatedRecord) {
      return NextResponse.json({
        msg: "Material deleted",
        statusCode: 200,
        updatedRecord,
      });
    }
    return NextResponse.json({
      msg: "Material delete falied",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteStudyMaterial route",
      statusCode: 204,
      error,
    });
  }
}
