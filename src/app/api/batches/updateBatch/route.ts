import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
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

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const timeZone = "Asia/Kathmandu";

    const utcBatchStartDate = reqBody?.batchStartDate
      ? dayjs(reqBody?.batchStartDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcBatchEndDate = reqBody?.batchEndDate
      ? dayjs(reqBody?.batchEndDate).tz(timeZone).startOf("day").utc()
      : "";

    // Check if another batch already has the same name
    const existingBatch = await Batch.findOne({
      batchName: {
        $regex: `^${escapeRegex(reqBody.batchName)}$`,
        $options: "i",
      },
      _id: { $ne: reqBody._id }, // Exclude the current batch
    });

    if (existingBatch) {
      return NextResponse.json({
        msg: "Batch name already exists",
        statusCode: 409, // Conflict status
      });
    }
    //update batch
    const updatedBatch = await Batch.findOneAndUpdate(
      { _id: reqBody._id },
      {
        ...reqBody,
        batchStartDate: utcBatchStartDate,
        batchEndDate: utcBatchEndDate,
      }
    );
    if (updatedBatch) {
      return NextResponse.json({
        msg: "Batch updated",
        statusCode: 200,
        updatedBatch,
      });
    }
    return NextResponse.json({
      msg: "Batch update failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in updateBatch route",
      statusCode: 204,
      error,
    });
  }
}
