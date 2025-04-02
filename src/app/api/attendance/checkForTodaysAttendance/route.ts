import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Attendance from "@/models/AttendanceModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    // start and end date
    const startOfDay = dayjs().tz(timeZone).startOf("day").utc().format(); // 2025-03-16T00:00:00.000Z
    const endOfDay = dayjs().tz(timeZone).endOf("day").utc().format();

    // if attendance for today already exits
    let attendanceRecord = await Attendance.findOne({
      utcDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // todays attendance recrd found
    if (attendanceRecord) {
      return NextResponse.json({
        msg: "Todays attendance record found",
        statusCode: 200,
        attendanceRecord,
      });
    }

    return NextResponse.json({
      msg: "Todays attendance record not found",
      statusCode: 204,
    });
  } catch (error) {
    console.error("Internal error in attendance route", error);
    return NextResponse.json({
      msg: "Internal error in attendance",
      statusCode: 500,
      error,
    });
  }
}
