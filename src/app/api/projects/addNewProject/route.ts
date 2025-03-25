import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";
    const reqBody = await req.json();
    console.log(reqBody);
    const utcStartDate = reqBody?.startDate
      ? dayjs(reqBody?.startDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcEndDate = reqBody?.endDate
      ? dayjs(reqBody?.endDate).tz(timeZone).startOf("day").utc()
      : "";
    console.log(
      "after converting startdate and enddate to utc",
      utcStartDate,
      utcEndDate
    );

    const projectExists = await Project.findOne({
      name: { $regex: new RegExp(`^${reqBody.name}$`, "i") },
    });
    if (projectExists) {
      return NextResponse.json({
        msg: "Project name already exists",
        statusCode: 204,
      });
    }
    const newProject = new Project({
      ...reqBody,
      startDate: utcStartDate,
      endDate: utcEndDate,
    });
    const savednewProject = await newProject.save();
    // new user added success
    if (savednewProject) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New project added",
        savednewProject,
      });
    }
    // user add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new project",
    });
  } catch (error) {
    console.log("Internal error in addnewProject route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewProject route",
      error,
    });
  }
}
