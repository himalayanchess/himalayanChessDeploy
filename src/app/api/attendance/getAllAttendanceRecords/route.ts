import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Attendance from "@/models/AttendanceModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allAttendanceRecords = await Attendance.find({});
    if (allAttendanceRecords) {
      return NextResponse.json({
        msg: "All attendance records found",
        statusCode: 200,
        allAttendanceRecords,
      });
    }
    return NextResponse.json({
      msg: "All attendance records fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallAttendanceRecords",
      statusCode: 204,
      error,
    });
  }
}
