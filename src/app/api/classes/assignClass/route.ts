import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import ActivityRecord from "@/models/ActivityRecordModel";
import { Activity } from "lucide-react";
import { dbconnect } from "@/helpers/dbconnect/dbconnect";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export async function POST(request: NextRequest) {
  try {
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
      startTime,
      endTime,
      holidayStatus,
      holidayDescription,
      trainerPresentStatus,
    } = reqBody;
    // 3 fields from dayjs
    const weekNumber = dayjs(date).week();
    const weekStartDate = dayjs(date).startOf("isoWeek").toISOString();
    const weekEndDate = dayjs(date).endOf("isoWeek").toISOString();
    //extract date
    const formattedDate = date.split("T")[0];
    const startOfDay = new Date(`${formattedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${formattedDate}T23:59:59.999Z`);

    console.log("passed date", date);

    console.log("start of day", startOfDay);
    console.log("end of day", endOfDay);

    const classExists = await ActivityRecord.findOne({
      batchId, // Ensure only one batch is assigned
      date: { $gte: startOfDay, $lte: endOfDay }, // Match only for this day
      activeStatus: true,
    });
    if (classExists) {
      console.log(`class Exists for ${batchId} in ${date}`);
      return NextResponse.json({
        msg: `class Exists for ${batchId} in ${date}`,
        statusCode: 204,
      });
    }

    // Check for overlapping time slots for the batch on the given day, considering affiliatedTo and projectId
    const batchOverlappingTime = await ActivityRecord.findOne({
      batchId: { $ne: batchId }, // Exclude the current batchId
      date: { $gte: startOfDay, $lte: endOfDay }, // Match only for this specific day
      $or: [
        {
          startTime: { $lt: endTime }, // Existing class starts before new one ends
          endTime: { $gt: startTime }, // Existing class ends after new one starts
        },
      ],
      affiliatedTo: "HCA", // If affiliated to HCA, don't allow overlapping for the same projectId
      activeStatus: true,
    });

    if (
      batchOverlappingTime &&
      batchOverlappingTime.affiliatedTo === "HCA" &&
      batchOverlappingTime.projectId === projectId
    ) {
      console.log(
        `HCA cannot have overlapping classes for the same projectId on ${date}`
      );
      return NextResponse.json({
        msg: `HCA cannot have overlapping classes for the same projectId on ${date}`,
        statusCode: 204,
      });
    }

    // If affiliatedTo is "school", allow different projectId overlaps
    const schoolOverlappingTime = await ActivityRecord.findOne({
      batchId: { $ne: batchId }, // Exclude the current batchId
      date: { $gte: startOfDay, $lte: endOfDay }, // Match only for this specific day
      $or: [
        {
          startTime: { $lt: endTime }, // Existing class starts before new one ends
          endTime: { $gt: startTime }, // Existing class ends after new one starts
        },
      ],
      affiliatedTo: "school", // If affiliated to school, allow multiple projects
      projectId: { $ne: projectId }, // Ensure the existing projectId is not the same as the new projectId
      activeStatus: true,
    });

    if (schoolOverlappingTime) {
      console.log(
        `Time slot is already reserved for a different project associated with school on ${date}`
      );
      return NextResponse.json({
        msg: `Time slot is already reserved for a different project associated with school on ${date}`,
        statusCode: 204,
      });
    }

    // const overlappingTeacherClass = await ActivityRecord.findOne({
    //   trainerId, // Assuming trainerId exists in the model
    //   date: { $gte: startOfDay, $lte: endOfDay }, // Match only for this specific day
    //   $or: [
    //     {
    //       startTime: { $lt: endTime }, // Teacher's existing class starts before new one ends
    //       endTime: { $gt: startTime }, // Teacher's existing class ends after new one starts
    //     },
    //     {
    //       startTime: { $gte: startTime, $lt: endTime }, // Class starts within the new class time
    //       endTime: { $gt: startTime, $lte: endTime }, // Class ends within the new class time
    //     },
    //   ],
    //   // Allow multiple projects, but only check time overlap for the same projectId
    //   // (No overlap for the same time slot in the same project)
    //   projectId: { $ne: projectId },
    // });

    // if (overlappingTeacherClass) {
    //   console.log(
    //     `Teacher time overlap for ${trainerName} in ${startTime} - ${endTime} for a different project`
    //   );
    //   return NextResponse.json({
    //     msg: `Teacher time overlap for ${trainerName} in ${startTime} - ${endTime} for a different project`,
    //     statusCode: 204,
    //   });
    // }

    // add to assign class
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
