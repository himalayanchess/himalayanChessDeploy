import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import Payment from "@/models/PaymentModel";
import Branch from "@/models/BranchModel";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";

import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import ActivityRecord from "@/models/ActivityRecordModel";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import Project from "@/models/ProjectModel";
import Course from "@/models/CourseModel";
import StudyMaterial from "@/models/StudyMaterialsModel";
import LeaveRequest from "@/models/LeaveRequestModel";
import Batch from "@/models/BatchModel";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    const { trainerId, branchName } = reqBody;

    const today = dayjs().tz(timeZone);
    const startOfWeek = today.startOf("week");
    const endOfWeek = today.endOf("week");
    const startOfToday = dayjs().startOf("day").toDate();
    const endOfToday = dayjs().endOf("day").toDate();

    const [
      todaysTrainersAssignedClasses,
      trainersAssignedSchools,
      upcomingTrainersClasses,
      pendingLeaveRequests,
    ] = await Promise.all([
      ActivityRecord.find({
        activeStatus: true,
        trainerId,
        utcDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),

      await Project.find({
        activeStatus: true,
        assignedTrainers: {
          $elemMatch: {
            trainerId: trainerId,
            $or: [{ endDate: null }, { endDate: { $exists: false } }],
          },
        },
      }),

      ActivityRecord.find({
        activeStatus: true,
        trainerId,
        utcDate: {
          $gt: endOfToday,
        },
      }),
      LeaveRequest.countDocuments({
        approvalStatus: "pending",
        activeStatus: true,
        userId: trainerId,
      }),
    ]);

    return NextResponse.json({
      date: today.format("D MMMM, YYYY"),
      todaysTrainersAssignedClasses,
      trainersAssignedSchools,
      upcomingTrainersClasses: upcomingTrainersClasses?.sort(
        (a: any, b: any) =>
          dayjs.tz(a.utcDate, "Asia/Kathmandu").valueOf() -
          dayjs.tz(b.utcDate, "Asia/Kathmandu").valueOf()
      ),
      totalClasses: todaysTrainersAssignedClasses.length,
      classesTaken: todaysTrainersAssignedClasses.filter(
        (classRecord: any) => classRecord.recordUpdatedByTrainer === true
      ).length,
      pendingLeaveRequests,
    });
  } catch (err: any) {
    console.error("Error fetching trainers dashboard data:", err);
    return NextResponse.json({
      msg: "Dashboard data fetch failed.",
      statusCode: 500,
      error: err.message,
    });
  }
}
