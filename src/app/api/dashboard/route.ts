import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import Attendance from "@/models/AttendanceModel";
import Payment from "@/models/PaymentModel";

import Course from "@/models/CourseModel";
import Branch from "@/models/BranchModel";

import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    console.log("logging dashboard data ", reqBody);

    const { passedRole, branchName, isGlobalAdmin } = reqBody;

    const today = dayjs().tz(timeZone);
    const monthStart = today.tz(timeZone).startOf("month").toDate();
    const monthEnd = today.tz(timeZone).endOf("month").toDate();

    // is super or global admin
    const isSuperOrGlobalAdmin =
      passedRole?.toLowerCase() == "superadmin" || isGlobalAdmin;

    // dynamic admin user count query
    let adminUserQuery: any = { role: "Admin" };
    // If passedRole is not superadmin or globaladmin, add branchName condition
    if (!isSuperOrGlobalAdmin) {
      adminUserQuery.branchName = branchName; // Add branch condition
    }

    // dynamic trainer user count query
    let trainerUserQuery: any = { role: "Trainer" };
    // If passedRole is not superadmin or globaladmin, add branchName condition
    if (!isSuperOrGlobalAdmin) {
      trainerUserQuery.branchName = branchName; // Add branch condition
    }

    const [
      presentCount,
      absentCount,
      leaveCount,
      holidayCount,

      adminCount,
      trainerCount,

      pendingPayments,
      partialPayments,

      branches,
    ] = await Promise.all([
      Attendance.countDocuments({
        date: { $gte: monthStart, $lte: monthEnd },
        status: "Present",
      }),
      Attendance.countDocuments({
        date: { $gte: monthStart, $lte: monthEnd },
        status: "Absent",
      }),
      Attendance.countDocuments({
        date: { $gte: monthStart, $lte: monthEnd },
        status: "Leave",
      }),
      Attendance.countDocuments({
        date: { $gte: monthStart, $lte: monthEnd },
        status: "Holiday",
      }),

      // Dynamic user query
      User.countDocuments(adminUserQuery),
      User.countDocuments(trainerUserQuery),

      Payment.countDocuments({ status: "Pending" }),
      Payment.countDocuments({ status: "Partial" }),

      Branch.countDocuments({}),
    ]);

    return NextResponse.json({
      date: today.format("D MMMM, YYYY"),
      attendance: {
        Present: presentCount,
        Absent: absentCount,
        Leave: leaveCount,
        Holiday: holidayCount,
      },
      users: {
        Admin: adminCount,
        Trainers: trainerCount,
      },

      payment: {
        Pending: pendingPayments,
        Partial: partialPayments,
      },
      branches,
    });
  } catch (err: any) {
    console.error("Error fetching dashboard data:", err);
    return NextResponse.json({
      msg: "Dashboard data fetch failed.",
      statusCode: 500,
      error: err.message,
    });
  }
}
