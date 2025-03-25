import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import Batch from "@/models/BatchModel";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

function escapeRegex(string: any) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();
    const timeZone = "Asia/Kathmandu";
    console.log(reqBody);
    const utcBatchStartDate = reqBody?.batchStartDate
      ? dayjs(reqBody?.batchStartDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcBatchEndDate = reqBody?.batchEndDate
      ? dayjs(reqBody?.batchEndDate).tz(timeZone).startOf("day").utc()
      : "";

    const batchExists = await Batch.findOne({
      batchName: {
        $regex: `^${escapeRegex(reqBody.batchName)}$`,
        $options: "i",
      },
    });
    if (batchExists) {
      return NextResponse.json({
        statusCode: 204,
        msg: "Batch already exists",
      });
    }
    const newBatch = new Batch({
      ...reqBody,
      batchStartDate: utcBatchStartDate,
      batchEndDate: utcBatchEndDate,
    });
    const savedNewBatch = await newBatch.save();
    // new batch added success
    if (savedNewBatch) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New batch added",
        savedNewBatch,
      });
    }
    // batch add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new batch",
    });
  } catch (error) {
    console.log("Internal error in addNewBatch route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewBatch route",
      error,
    });
  }
}
