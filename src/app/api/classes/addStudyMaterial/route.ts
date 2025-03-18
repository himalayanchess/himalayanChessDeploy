import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { todaysClassId, studyMaterial } = reqBody;

    //appen study material
    const updatedTodaysClass = await ActivityRecord.findOneAndUpdate(
      { _id: todaysClassId },
      { $push: { studyMaterials: studyMaterial } },
      { new: true } // Returns the updated document
    );

    if (updatedTodaysClass) {
      return NextResponse.json({
        msg: "Study material added",
        statusCode: 200,
        updatedTodaysClass,
      });
    }
    return NextResponse.json({
      msg: "Study material addition failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in addStudyMaterial route", error);
    return NextResponse.json({
      msg: "Internal error in addStudyMaterial route",
      statusCode: 204,
      error,
    });
  }
}
