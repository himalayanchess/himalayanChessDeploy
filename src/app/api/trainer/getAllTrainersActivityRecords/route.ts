import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    const allTrainersActivityRecords = await ActivityRecord.find({
      trainerId: reqBody?.trainerId,
    });
    if (allTrainersActivityRecords) {
      return NextResponse.json({
        msg: "All assigned classes found",
        statusCode: 200,
        allTrainersActivityRecords,
      });
    }
    return NextResponse.json({
      msg: "All assigned classes fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallTrainersActivityRecords route", error);
    return NextResponse.json({
      msg: "Internal error in getallTrainersActivityRecords",
      statusCode: 204,
      error,
    });
  }
}
