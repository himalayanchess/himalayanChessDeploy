import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();

    const allActivityRecords = await ActivityRecord.find({});

    if (allActivityRecords) {
      return NextResponse.json({
        msg: "All Activity Record found",
        statusCode: 200,
        allActivityRecords,
      });
    }
    return NextResponse.json({
      msg: "All Activity Record fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in allActivityRecords",
      statusCode: 204,
      error,
    });
  }
}
