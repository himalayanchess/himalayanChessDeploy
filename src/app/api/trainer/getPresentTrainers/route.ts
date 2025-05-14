import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import Attendance from "@/models/AttendanceModel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTimePickerDefaultizedProps } from "@mui/x-date-pickers/TimePicker/shared";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { todaysDate } = reqBody; // Nepali date string passed from the client (ISO format)

    const passedNepaliDate = dayjs(todaysDate)?.tz(timeZone)?.startOf("day");
    const startOfDay = dayjs(passedNepaliDate)
      .tz(timeZone)
      .startOf("day")
      .utc()
      .toDate(); // 2025-04-27T18:15:00.000Z in date from not in string
    // .format() was giving it in string so no result was given
    const endOfDay = dayjs(passedNepaliDate)
      .tz(timeZone)
      .endOf("day")
      .utc()
      .toDate();

    // Query to find records where nepaliDate matches exactly
    const presentTrainers = await Attendance.aggregate([
      {
        $match: {
          utcDate: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { $unwind: "$userAttendance" },
      {
        $match: {
          "userAttendance.status": {
            $regex: /^present$/i, // case-insensitive exact match
          },
          "userAttendance.userRole": {
            $regex: /^trainer$/i, // case-insensitive exact match
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$userAttendance.userId",
          userName: "$userAttendance.userName",
          userRole: "$userAttendance.userRole",
          status: "$userAttendance.status",
          utcDate: "$utcDate",
          nepaliDate: "$nepaliDate",
        },
      },
    ]);

    if (presentTrainers) {
      return NextResponse.json({
        msg: "Fetched present trainers",
        statusCode: 200,
        presentTrainersList: presentTrainers,
      });
    }
    return NextResponse.json({
      msg: "Failed to Fetched present trainers",
      statusCode: 204,
    });
  } catch (error) {
    console.error("Error fetching present trainers:", error);
    return NextResponse.json({
      msg: "Error fetching present trainers",
      statusCode: 500,
      error,
    });
  }
}
