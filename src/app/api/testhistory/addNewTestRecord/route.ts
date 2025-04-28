import { NextRequest, NextResponse } from "next/server";
import { Activity } from "lucide-react";
import { dbconnect } from "@/helpers/dbconnect/dbconnect";
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
    const timeZone = "Asia/Kathmandu";
    await dbconnect();
    const reqBody = await request.json();
    console.log("addnew test record api", reqBody);

    const {
      affiliatedTo,
      examDate,
      studentId,
      studentName,
      branchId,
      branchName,
      batchId,
      batchName,
      courseId,
      courseName,
      examTitle,
      totalMarks,
      passMarks,
      obtainedScore,
      activeStatus,
    } = reqBody;

    // first convert date to nepali time format (understanding)
    const passedNepaliDate = dayjs(examDate).tz(timeZone).startOf("day");
    console.log("passed nepali date", passedNepaliDate.format());
    const convertedUtcDate = dayjs(examDate).tz(timeZone).startOf("day").utc();

    // calculate resultStatus
    let resultStatus = "";
    if (obtainedScore >= passMarks) {
      resultStatus = "Pass";
    } else {
      resultStatus = "Below Pass Marks";
    }
    // add to test history
    const newTestRecord = new TestHistory({
      ...reqBody,
      resultStatus,
      examUtcDate: convertedUtcDate,
      examNepaliDate: passedNepaliDate.format(),
    });
    const savednewTestRecord = await newTestRecord.save();

    if (savednewTestRecord) {
      return NextResponse.json({
        statusCode: 200,
        msg: "Test Record added",
        savednewTestRecord,
      });
    }

    return NextResponse.json({
      msg: "Failed to add test record ",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in add new test record route", error);
    return NextResponse.json({
      msg: "Internal error in add new test record route",
      statusCode: 204,
      error,
    });
  }
}
