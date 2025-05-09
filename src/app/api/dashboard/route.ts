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
    console.log("Logging dashboard data:", reqBody);

    const { passedRole, branchName, isGlobalAdmin } = reqBody;

    const today = dayjs().tz(timeZone);
    const startOfWeek = today.startOf("week");
    const endOfWeek = today.endOf("week");
    const startOfToday = dayjs().startOf("day").toDate();
    const endOfToday = dayjs().endOf("day").toDate();

    const isSuperOrGlobalAdmin =
      passedRole?.toLowerCase() === "superadmin" || isGlobalAdmin;

    // branch filter
    const branchFilter = isSuperOrGlobalAdmin ? {} : { branchName };

    // overall filter
    const overallFilter = {
      activeStatus: true,
      ...branchFilter,
    };

    const [
      todaysAssignedClasses,
      hcaStudents,
      schoolStudents,
      users,
      pendingPayments,
      partialPayments,
      paidPayments,
      affiliatedSchools,
      totalCourses,
      totalBranches,
      pendingLeaveRequests,
      totalStudyMaterials,
      activeBranchBatchList,
    ] = await Promise.all([
      ActivityRecord.find({
        ...overallFilter,
        utcDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),
      HcaAffiliatedStudent.find(overallFilter).select(
        "_id name dob role branchName branchId imageUrl"
      ),
      NonAffiliatedStudent.countDocuments({ activeStatus: true }),
      User.find({ ...overallFilter, isActive: true }).select(
        "_id name dob role branchName branchId imageUrl"
      ),
      Payment.countDocuments({ paymentStatus: "Pending", ...overallFilter }),
      Payment.countDocuments({ paymentStatus: "Partial", ...overallFilter }),
      Payment.countDocuments({ paymentStatus: "Paid", ...overallFilter }),
      Project.countDocuments({ activeStatus: true }),
      Course.countDocuments({ activeStatus: true }),
      Branch.countDocuments({ activeStatus: true }),
      LeaveRequest.countDocuments({
        approvalStatus: "pending",
        ...overallFilter,
      }),
      StudyMaterial.countDocuments({ activeStatus: true }),
      Batch.find({
        activeStatus: true,
        branchName: reqBody?.branchName,
      }),
    ]);

    // Combine all people from HCA students and users
    const allPeople = [
      ...hcaStudents.map((s: any) => ({
        ...s.toObject(),
        extractedRole: "Student",
      })),
      ...users.map((u: any) => ({ ...u.toObject(), extractedRole: u?.role })),
    ];

    // Prepare day/month for each day this week
    const weekDates: any = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, "day");
      weekDates.push({ day: date.date(), month: date.month() }); // month is 0-indexed
    }

    // Filter birthdays this week (by day/month only)
    const birthdayThisWeek = allPeople
      .filter((person) => {
        if (!person.dob) return false;
        const dob = dayjs(person.dob).tz(timeZone);
        return weekDates.some(
          (d: any) => d.day === dob.date() && d.month === dob.month()
        );
      })
      .sort((a, b) => {
        const dayA = dayjs(a.dob).tz(timeZone).date();
        const dayB = dayjs(b.dob).tz(timeZone).date();
        return dayA - dayB;
      });

    return NextResponse.json({
      date: today.format("D MMMM, YYYY"),

      birthdayThisWeek,
      todaysAssignedClasses,
      totalClasses: todaysAssignedClasses.length,
      classesTaken: todaysAssignedClasses.filter(
        (classRecord: any) => classRecord.recordUpdatedByTrainer === true
      ).length,
      hcaAffiliatedStudents: hcaStudents?.length || 0,
      schoolStudents,
      adminUsers: users?.filter(
        (user: any) => user?.role?.toLowerCase() == "admin"
      )?.length,
      trainerUsers: users?.filter(
        (user: any) => user?.role?.toLowerCase() == "trainer"
      )?.length,
      pendingPayments,
      partialPayments,
      paidPayments,
      affiliatedSchools,
      totalCourses,
      totalBranches,
      pendingLeaveRequests,
      totalStudyMaterials,
      activeBranchBatchList,
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
