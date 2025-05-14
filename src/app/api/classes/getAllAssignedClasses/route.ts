import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allAssignedClasses = await ActivityRecord.find({});
    if (allAssignedClasses) {
      return NextResponse.json({
        msg: "All assigned classes found",
        statusCode: 200,
        allAssignedClasses,
      });
    }
    return NextResponse.json({
      msg: "All assigned classes fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallAssignedClasses",
      statusCode: 204,
      error,
    });
  }
}
