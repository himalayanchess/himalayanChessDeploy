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

    // Convert start and end date of the project
    const utcStartDate = reqBody?.startDate
      ? dayjs(reqBody?.startDate).tz(timeZone).startOf("day").utc().toDate()
      : null;

    const utcEndDate = reqBody?.endDate
      ? dayjs(reqBody?.endDate).tz(timeZone).startOf("day").utc().toDate()
      : null;

    // Convert startDate and endDate for assigned trainers
    const updatedAssignedTrainers = reqBody.assignedTrainers?.map(
      (trainer: any) => {
        const updatedTrainer = { ...trainer };
        if (trainer.startDate) {
          updatedTrainer.startDate = dayjs(trainer.startDate)
            .tz(timeZone)
            .startOf("day")
            .utc()
            .toDate();
        }
        if (trainer.endDate) {
          updatedTrainer.endDate = dayjs(trainer.endDate)
            .tz(timeZone)
            .startOf("day")
            .utc()
            .toDate();
        }
        return updatedTrainer;
      }
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
      assignedTrainers: updatedAssignedTrainers,
    });

    const savednewProject = await newProject.save();

    if (savednewProject) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New project added",
        savednewProject,
      });
    }

    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new project",
    });
  } catch (error) {
    console.log("Internal error in addNewProject route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewProject route",
      error,
    });
  }
}
