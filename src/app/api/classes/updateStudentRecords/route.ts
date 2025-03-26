import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { activityRecordId, studentRecords, mainStudyTopic } = reqBody;
    console.log(studentRecords);

    const updatedActivityRecord = await ActivityRecord.findByIdAndUpdate(
      { _id: activityRecordId },
      {
        studentRecords,
        recordUpdatedByTrainer: true,
        trainerPresentStatus: "present",
        mainStudyTopic,
      },
      { new: true }
    );
    if (updatedActivityRecord) {
      return NextResponse.json({
        msg: "Student records updated",
        statusCode: 200,
        updatedActivityRecord,
      });
    }
    return NextResponse.json({
      msg: "Student records update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateStudentRecords route", error);
    return NextResponse.json({
      msg: "Internal error in updateStudentRecords route",
      statusCode: 204,
      error,
    });
  }
}
