import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import TestHistory from "@/models/TestHistoryModel";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const timeZone = "Asia/Kathmandu";

    const {
      _id, // Expecting _id to identify which test record to update
      examDate,
      obtainedScore,
      passMarks,
    } = reqBody;

    if (!_id) {
      return NextResponse.json({
        msg: "Test record ID (_id) is required",
        statusCode: 400,
      });
    }

    // Convert new examDate if provided
    const updatedExamUtcDate = examDate
      ? dayjs(examDate).tz(timeZone).startOf("day").utc()
      : undefined;

    const updatedExamNepaliDate = examDate
      ? dayjs(examDate).tz(timeZone).startOf("day").format()
      : undefined;

    // Recalculate resultStatus if obtainedScore and passMarks are provided
    let resultStatus = "";
    resultStatus = obtainedScore >= passMarks ? "Pass" : "Below Pass Marks";    

    // Build update fields
    const updateFields: any = {
      ...reqBody,
    };

    if (updatedExamUtcDate) {
      updateFields.examUtcDate = updatedExamUtcDate;
    }

    if (updatedExamNepaliDate) {
      updateFields.examNepaliDate = updatedExamNepaliDate;
    }

    if (resultStatus) {
      updateFields.resultStatus = resultStatus;
    }

    const updatedTestRecord = await TestHistory.findOneAndUpdate(
      { _id },
      updateFields,
      { new: true } // Return the updated document
    );

    if (updatedTestRecord) {
      return NextResponse.json({
        msg: "Test record updated",
        statusCode: 200,
        updatedTestRecord,
      });
    }

    return NextResponse.json({
      msg: "Test record update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateTestRecord route", error);
    return NextResponse.json({
      msg: "Internal error in updateTestRecord route",
      statusCode: 204,
      error,
    });
  }
}
