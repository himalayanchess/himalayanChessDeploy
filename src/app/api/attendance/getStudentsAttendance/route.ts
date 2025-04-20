import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const convertedNepaliDate = reqBody.selectedDay;

    const studentsAttendanceRecord = await ActivityRecord.findOne({
      nepaliDate: convertedNepaliDate,
      batchName: reqBody?.selectedBatch,
    });

    // console.log(
    //   "resut getStudentsAttendance",
    //   convertedNepaliDate,
    //   studentsAttendanceRecord
    // );
    if (studentsAttendanceRecord) {
      return NextResponse.json({
        msg: "Students Attendance Record found",
        statusCode: 200,
        studentsAttendanceRecord,
      });
    }

    return NextResponse.json({
      msg: "Students Attendance fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getStudentsAttendance route", error);
    return NextResponse.json({
      msg: "Internal error in getStudentsAttendance",
      statusCode: 204,
      error,
    });
  }
}
