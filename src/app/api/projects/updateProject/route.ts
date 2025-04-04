import { dbconnect } from "@/helpers/dbconnect/dbconnect";
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

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";
    const reqBody = await request.json();

    console.log("update project ", reqBody);

    // Convert project-level startDate and endDate to UTC
    const utcStartDate = reqBody?.startDate
      ? dayjs(reqBody?.startDate).tz(timeZone).startOf("day").utc().toDate()
      : null;
    const utcEndDate = reqBody?.endDate
      ? dayjs(reqBody?.endDate).tz(timeZone).startOf("day").utc().toDate()
      : null;

    // Convert startDate and endDate for each assigned trainer
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

    // Check for name duplication excluding the current project
    const existingProject = await Project.findOne({
      name: { $regex: `^${reqBody.name}$`, $options: "i" },
      _id: { $ne: reqBody._id },
    });

    if (existingProject) {
      return NextResponse.json({
        msg: "Project already exists",
        statusCode: 409,
      });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: reqBody._id },
      {
        ...reqBody,
        startDate: utcStartDate,
        endDate: utcEndDate,
        assignedTrainers: updatedAssignedTrainers,
      },
      { new: true } // return the updated document
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
