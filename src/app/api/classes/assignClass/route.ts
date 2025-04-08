import { NextRequest, NextResponse } from "next/server";
import ActivityRecord from "@/models/ActivityRecordModel";
import { Activity } from "lucide-react";
import { dbconnect } from "@/helpers/dbconnect/dbconnect";
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
      isPlayDay,
      startTime,
      endTime,
      holidayStatus,
      holidayDescription,
      userPresentStatus,
    } = reqBody;

    // first convert date to nepali time format (understanding)
    const passedNepaliDate = dayjs(date).startOf("day").tz(timeZone);
    console.log("first neplia date", passedNepaliDate.format());
    const convertedUtcDate = dayjs(passedNepaliDate)
      .tz(timeZone)
      .startOf("day")
      .utc();

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
      console.log(`Class exists for ${batchId} on ${date}`);
      return NextResponse.json({
        msg: `Record for this batchId already exists on this date`,
        statusCode: 204,
      });
    }

    // // Check for overlapping time slots for the batch on the given day, considering affiliatedTo and projectId
    // const batchOverlappingTime = await ActivityRecord.findOne({
    //   batchId: { $ne: batchId }, // Exclude the current batchId
    //   date: { $gte: startOfDay, $lte: endOfDay }, // Match only for this specific day
    //   $or: [
    //     {
    //       startTime: { $lt: endTime }, // Existing class starts before new one ends
    //       endTime: { $gt: startTime }, // Existing class ends after new one starts
    //     },
    //   ],
    //   affiliatedTo: "HCA", // If affiliated to HCA, don't allow overlapping for the same projectId
    //   activeStatus: true,
    // });

    // if (
    //   batchOverlappingTime &&
    //   batchOverlappingTime.affiliatedTo.toLowerCase() == "hca" &&
    //   batchOverlappingTime.projectId === projectId
    // ) {
    //   console.log(
    //     `HCA cannot have overlapping classes for the same projectId on ${date}`
    //   );
    //   return NextResponse.json({
    //     // msg: `HCA cannot have overlapping classes for the same projectId on ${date}`,
    //     msg: `Time overlap with ${batchOverlappingTime?.batchName}`,

    //     statusCode: 204,
    //   });
    // }

    // // If affiliatedTo is "school", allow different projectId overlaps
    // const schoolOverlappingTime = await ActivityRecord.findOne({
    //   batchId: { $ne: batchId }, // Exclude the current batchId
    //   date: { $gte: startOfDay, $lte: endOfDay }, // Match only for this specific day
    //   $or: [
    //     {
    //       startTime: { $lt: endTime }, // Existing class starts before new one ends
    //       endTime: { $gt: startTime }, // Existing class ends after new one starts
    //     },
    //   ],
    //   affiliatedTo: "School", // If affiliated to school, allow multiple projects
    //   projectId: projectId, // Ensure it's from the same project
    //   activeStatus: true,
    // });

    // if (schoolOverlappingTime) {
    //   console.log(
    //     `Time slot is already reserved for a different project associated with school on ${date}`
    //   );
    //   return NextResponse.json({
    //     // msg: `Time slot is already reserved for a different project associated with school on ${date}`,
    //     msg: `Time overlap with ${schoolOverlappingTime?.batchName}`,
    //     statusCode: 204,
    //   });
    // }

    // add to assign class
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
