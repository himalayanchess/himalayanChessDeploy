import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Project from "@/models/ProjectModel";
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
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    const reqBody = await request.json();
    const utcStartDate = reqBody?.startDate
      ? dayjs(reqBody?.startDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcEndDate = reqBody?.endDate
      ? dayjs(reqBody?.endDate).tz(timeZone).startOf("day").utc()
      : "";

    const updatedProject = await Project.findOneAndUpdate(
      { _id: reqBody._id },
      {
        ...reqBody,
        startDate: utcStartDate,
        endDate: utcEndDate,
      }
    );
    if (updatedProject) {
      return NextResponse.json({
        msg: "Project updated",
        statusCode: 200,
        updatedProject,
      });
    }
    return NextResponse.json({
      msg: "Project update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateProject route", error);
    return NextResponse.json({
      msg: "Internal error in updateProject route",
      statusCode: 204,
      error,
    });
  }
}
