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

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";
    const reqBody = await request.json();
    console.log("inside attendannce", reqBody);

    const utcDate = dayjs().tz(timeZone).startOf("day").utc();
    const nepaliDate = dayjs().startOf("day").tz(timeZone);

    // 3 fields from dayjs
    const weekNumber = dayjs().week();
    const weekStartDate = dayjs().startOf("isoWeek").toISOString();
    const weekEndDate = dayjs().endOf("isoWeek").toISOString();

    // start and end date
    const startOfDay = dayjs().tz(timeZone).startOf("day").utc().format(); // 2025-03-16T00:00:00.000Z
    const endOfDay = dayjs().tz(timeZone).endOf("day").utc().format();

    // if attendance for today already exits
    let attendanceRecord = await Attendance.findOne({
      utcDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // Create new attendance record
    if (!attendanceRecord) {
      attendanceRecord = new Attendance({
        utcDate,
        nepaliDate: nepaliDate.format(),
        weekNumber,
        weekStartDate,
        weekEndDate,
        activeStatus: true,
        userAttendance: reqBody?.userAttendance,
        updatedBy: [{ ...reqBody?.updatedByUser }],
      });

      console.log("new attendance created");
    }
    // Update existing record
    else {
      attendanceRecord.userAttendance = reqBody?.userAttendance;
      attendanceRecord.updatedBy.push({ ...reqBody?.updatedByUser });

      console.log("Updated previous attendance ");
    }

    const savedAttendance = await attendanceRecord.save();

    if (savedAttendance) {
      return NextResponse.json({
        msg: "Attendance Saved",
        statusCode: 200,
      });
    }

    return NextResponse.json({
      msg: "Failed to save attendance",
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
