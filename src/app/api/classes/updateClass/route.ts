import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Batch from "@/models/BatchModel";
import dayjs from "dayjs";
import ActivityRecord from "@/models/ActivityRecordModel";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const {
      date,
      startTime,
      endTime,
      trainerName,
      trainerId,
      trainerPresentStatus,
    } = reqBody;

    // const selectedDateOnly = dayjs(date).startOf("day"); // Strip time for comparison
    // const selectedStartTime = dayjs(startTime).startOf("day"); // Strip time
    // const selectedEndTime = dayjs(endTime).startOf("day");

    // const overlappingClass = await ActivityRecord.findOne({
    //   trainerId,
    //   date: selectedDateOnly.format("YYYY-MM-DD"), // Match only the date part
    //   _id: { $ne: reqBody._id },
    //   $or: [
    //     {
    //       startTime: { $lt: selectedEndTime }, // The start time of the existing class is before the new class end time
    //       endTime: { $gt: selectedStartTime }, // The end time of the existing class is after the new class start time
    //     },
    //   ],
    // });

    // if (overlappingClass) {
    //   return NextResponse.json({
    //     msg: "Time overlap for trainer",
    //     statusCode: 204,
    //   });
    // }

    //update Class
    const updatedClass = await ActivityRecord.findOneAndUpdate(
      { _id: reqBody._id },
      {
        trainerName,
        trainerId,
        trainerPresentStatus,
      },
      { new: true }
    );
    if (updatedClass) {
      return NextResponse.json({
        msg: "Class updated",
        statusCode: 200,
        updatedClass,
      });
    }
    return NextResponse.json({
      msg: "Class update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateClass route", error);
    return NextResponse.json({
      msg: "Internal error in updateClass route",
      statusCode: 204,
      error,
    });
  }
}
