import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import ActivityRecord from "@/models/ActivityRecordModel";
import { Activity } from "lucide-react";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    // (11 fields) fields from form data
    // (3 fields) date, affiliatedTo and holidayStatus from state variable
    // (14 fields) from frontend
    const {
      affiliatedTo,
      date,
      trainerName,
      trainerId,
      courseName,
      courseId,
      projectName,
      projectId,
      batchName,
      batchId,
      startTime,
      endTime,
      holidayStatus,
      holidayDescription,
    } = reqBody;
    // 3 fields from dayjs
    const weekNumber = dayjs(date).week();
    const weekStartDate = dayjs(date).startOf("isoWeek").toISOString();
    const weekEndDate = dayjs(date).endOf("isoWeek").toISOString();

    // check if class already assignted to (date,trainer,batch)
    const classExists = await ActivityRecord.exists({
      date,
      trainerId,
      batchId,
    });
    if (classExists) {
      return NextResponse.json({
        msg: "Class already assigned",
        statusCode: 204,
      });
    }

    // Check for overlapping time slots
    const overlappingClass = await ActivityRecord.findOne({
      date,

      batchId,
      $or: [
        {
          startTime: { $lt: endTime }, // Existing class starts before new one ends
          endTime: { $gt: startTime }, // Existing class ends after new one starts
        },
      ],
    });

    if (overlappingClass) {
      return NextResponse.json({
        msg: "Time slot overlap",
        statusCode: 204,
      });
    }
    const newAssignClass = new ActivityRecord({
      ...reqBody,
      weekNumber,
      weekStartDate,
      weekEndDate,
    });
    const savedNewAssignClass = await newAssignClass.save();

    if (savedNewAssignClass) {
      return NextResponse.json({
        statusCode: 200,
        msg: "Class Assigned",
        savedNewAssignClass,
      });
    }

    return NextResponse.json({
      msg: "Failed to assign class",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in assignClass route", error);
    return NextResponse.json({
      msg: "Internal error in assignClass route",
      statusCode: 204,
      error,
    });
  }
}
