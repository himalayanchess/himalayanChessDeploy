import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const activityRecord = await ActivityRecord.findOne({
      _id: reqBody?.activityRecordId,
    });
    if (activityRecord) {
      return NextResponse.json({
        msg: "Activity Record found",
        statusCode: 200,
        activityRecord,
      });
    }
    return NextResponse.json({
      msg: "Activity Record fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in activityRecord",
      statusCode: 204,
      error,
    });
  }
}
