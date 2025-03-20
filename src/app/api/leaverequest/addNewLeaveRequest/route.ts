import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import LeaveRequest from "@/models/LeaveRequestModel";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(req: NextRequest) {
  try {
    const timeZone = "Asia/Kathmandu";
    await dbconnect();
    const reqBody = await req.json();
    console.log("inside adding new leave request", reqBody);

    const passedNepaliDate = dayjs(reqBody?.date).tz(timeZone).startOf("day");
    const convertedUtcDate = dayjs(passedNepaliDate)
      .tz(timeZone)
      .startOf("day")
      .utc();

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

    const utcfromDate = dayjs(reqBody?.fromDate)
      .tz(timeZone)
      .startOf("day")
      .utc()
      .format(); // 2025-03-16T00:00:00.000Z
    const utctoDate = dayjs(reqBody?.toDate)
      .tz(timeZone)
      .startOf("day")
      .utc()
      .format();

    // check leave Request exists for today
    // one day one leave Request
    // const leaveRequestExisitsToday = await LeaveRequest.findOne({
    //   utcDate: { $gte: startOfDay, $lte: endOfDay }, // Match only for this day
    //   trainerId: reqBody?.trainerId, // Check for the same batchId
    //   activeStatus: true, // Ensure the record is active
    // });

    // if (leaveRequestExisitsToday) {
    //   return NextResponse.json({
    //     msg: "Leave request for today already exists",
    //     statusCode: 204,
    //   });
    // }

    // add new leave request
    const newLeaveRequest = new LeaveRequest({
      ...reqBody,
      nepaliDate: passedNepaliDate.format(),
      utcDate: convertedUtcDate,
      fromDate: utcfromDate,
      toDate: utctoDate,
    });

    const savedNewLeaveRequest = await newLeaveRequest.save();

    if (savedNewLeaveRequest) {
      return NextResponse.json({
        statusCode: 200,
        msg: "Leave requested",
        savedNewLeaveRequest,
      });
    }

    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add leave request",
    });
  } catch (error) {
    console.log("Internal error in addNewLeaveRequest route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewLeaveRequest route",
      error,
    });
  }
}
