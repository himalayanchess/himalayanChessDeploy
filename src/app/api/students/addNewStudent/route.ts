import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
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
    const {
      affiliatedTo,
      name,
      dob,
      gender,
      address,
      phone,
      joinedDate,
      endDate,
      batches,
      projectId,
      projectName,
      fideId,
      branchName,
      branchId,
      title,
      rating,
      completedStatus,
      enrolledCourses,
      eventsPlayed,
      history,
      guardianInfo,
      emergencyContactName,
      emergencyContactNo,
      selectedAffiliatedTo,
    } = reqBody;

    const utcJoinedDate = joinedDate
      ? dayjs(joinedDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcEndDate = endDate
      ? dayjs(endDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcDob = dob ? dayjs(dob).tz(timeZone).startOf("day").utc() : "";

    // batches to utcdate
    const utcconvertedBatches = batches.map((batch: any) => ({
      ...batch,
      startDate: dayjs(batch.startDate).tz(timeZone).startOf("day").utc(),
      endDate: batch?.endDate
        ? dayjs(batch.endDate).tz(timeZone).startOf("day").utc()
        : "",
    }));
    //enrolled courses to utc date
    const utcconvertedEnrolledCourses = enrolledCourses.map((course: any) => ({
      ...course,
      startDate: dayjs(course.startDate).tz(timeZone).startOf("day").utc(),
      endDate: course?.endDate
        ? dayjs(course.endDate).tz(timeZone).startOf("day").utc()
        : "",
    }));
    console.log("onverted coursees", utcconvertedEnrolledCourses);

    // Check if user with the same name exists (case-insensitive)
    const nonAffiliatedStudentExists = await NonAffiliatedStudent.findOne({
      name: { $regex: new RegExp(`^${reqBody.name}$`, "i") },
      fideId,
    });

    const hcaAffiliatedStudentExists = await HcaAffiliatedStudent.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      fideId,
    });

    if (nonAffiliatedStudentExists || hcaAffiliatedStudentExists) {
      return NextResponse.json({ msg: "User already exists", statusCode: 204 });
    }

    // add student accoring to selectedAffiliatedTo (hca)
    if (selectedAffiliatedTo?.toLowerCase() == "hca") {
      console.log(reqBody);

      const newStudent = new HcaAffiliatedStudent({
        affiliatedTo,
        name,
        dob: utcDob,
        gender,
        batches: utcconvertedBatches,
        joinedDate: utcJoinedDate,
        endDate: utcEndDate,
        address,
        phone,
        branchName,
        branchId,
        completedStatus,
        title,
        fideId,
        rating,
        guardianInfo,
        emergencyContactName,
        emergencyContactNo,
        enrolledCourses: utcconvertedEnrolledCourses,
      });
      const savedNewStudent = await newStudent.save();
      if (savedNewStudent) {
        return NextResponse.json({
          statusCode: 200,
          msg: "New HCA student added",
          savedNewStudent,
        });
      }
    }
    // add student accoring to selectedAffiliatedTo (school)
    if (selectedAffiliatedTo?.toLowerCase() == "school") {
      const newStudent = new NonAffiliatedStudent({
        affiliatedTo,
        name,
        dob: utcDob,
        gender,
        batches,
        joinedDate: utcJoinedDate,
        endDate: utcEndDate,
        projectId,
        projectName,
        completedStatus,
        title,
        fideId,
        rating,
      });
      const savedNewStudent = await newStudent.save();
      if (savedNewStudent) {
        return NextResponse.json({
          statusCode: 200,
          msg: "New school student added",
          savedNewStudent,
        });
      }
    }

    // user add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new user",
    });
  } catch (error) {
    console.log("Internal error in addnewSchoolStudent route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addnewSchoolStudent route",
      error,
    });
  }
}
