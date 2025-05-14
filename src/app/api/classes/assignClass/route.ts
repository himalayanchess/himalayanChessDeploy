import { NextRequest, NextResponse } from "next/server";
import ActivityRecord from "@/models/ActivityRecordModel";
import { Activity } from "lucide-react";
import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { sendAssignClassMail } from "@/helpers/nodemailer/nodemailer";
import Batch from "@/models/BatchModel";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    const timeZone = "Asia/Kathmandu";
    await dbconnect();
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
      description,
      currentClassNumber,
      isPlayDay,
      startTime,
      endTime,
      holidayStatus,
      holidayDescription,
      userPresentStatus,
    } = reqBody;

    // first convert date to nepali time format (understanding)
    const passedNepaliDate = dayjs(date).tz(timeZone).startOf("day");

    const convertedUtcDate = dayjs(date).tz(timeZone).startOf("day").utc();

    // 3 fields from dayjs
    const weekNumber = dayjs(passedNepaliDate).week();
    const weekStartDate = dayjs(passedNepaliDate)
      .startOf("isoWeek")
      .toISOString();
    const weekEndDate = dayjs(passedNepaliDate).endOf("isoWeek").toISOString();

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

    const classExists = await ActivityRecord.findOne({
      utcDate: { $gte: startOfDay, $lte: endOfDay }, // Match only for this day
      batchId, // Check for the same batchId
      activeStatus: true, // Ensure the record is active
    });

    if (classExists) {
      return NextResponse.json({
        msg: `Record for this batchId already exists on this date`,
        statusCode: 204,
      });
    }

    const newAssignClass = new ActivityRecord({
      ...reqBody,
      nepaliDate: passedNepaliDate.format(),
      utcDate: convertedUtcDate,
      weekNumber,
      weekStartDate,
      weekEndDate,
    });
    const savedNewAssignClass = await newAssignClass.save();

    if (savedNewAssignClass) {
      await sendAssignClassMail({
        subject: "Class assignment to trainer",
        assignedClass: reqBody,
      });

      // update batch by setting totalClassesTaken to reqBody.currentClassNumber
      const batchTotalTakenClassesUpdated = await Batch.findByIdAndUpdate(
        batchId,
        {
          totalClassesTaken: currentClassNumber,
        },
        { new: true }
      );
      if (batchTotalTakenClassesUpdated) {
        console.log(
          `batch updated after assignig class and set totalClassesTaken = reqBody.currentClassNumber`
        );
      }

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
    return NextResponse.json({
      msg: "Internal error in assignClass route",
      statusCode: 204,
      error,
    });
  }
}
