import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    const timeZone = "Asia/Kathmandu";
    await dbconnect();
    const reqBody = await request.json();
    const { trainerId, todaysDate } = reqBody;

    const passedNepaliDate = dayjs(todaysDate).startOf("day").tz(timeZone);
    const convertedUtcDate = dayjs(passedNepaliDate)
      .tz(timeZone)
      .startOf("day")
      .utc()
      .format();

    if (!trainerId || !todaysDate) {
      return NextResponse.json({
        msg: "Trainer ID and Date are required",
        statusCode: 400,
      });
    }

    const startOfDay = dayjs(passedNepaliDate)
      .tz(timeZone)
      .startOf("day")
      .utc()
      .format(); // 2025-03-16T00:00:00.000Z
    const endOfDay = dayjs(passedNepaliDate)
      .tz(timeZone)
      .endOf("day")
      .utc()
      .format();

    // Query for records on that specific date
    const trainersClasses = await ActivityRecord.find({
      trainerId: trainerId,
      utcDate: { $gte: startOfDay, $lte: endOfDay }, // Filter within that day
      activeStatus: true, // Optional: filter only active records
      userPresentStatus: "present",
    });

    if (trainersClasses) {
      return NextResponse.json({
        msg: "Records retrieved successfully",
        statusCode: 200,
        trainersTodaysClasses: trainersClasses,
      });
    }
    return NextResponse.json({
      msg: "Failed to retrive alltodaystrainerclasses",
      statusCode: 204,
    });
  } catch (error: any) {
    console.error("Internal error in getTrainersTodaysClasses route", error);
    return NextResponse.json({
      msg: "Internal server error",
      statusCode: 500,
      error: error.message,
    });
  }
}
