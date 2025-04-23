import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import {
  getFinalUpdatedBatches,
  getFinalUpdatedEnrolledCourses,
} from "@/helpers/updatestudent/finalUpdatedRecord";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";
    const reqBody = await request.json();
    console.log("update student ", reqBody);

    const {
      _id,
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
      title,
      rating,
      completedStatus,
      enrolledCourses,
      eventsPlayed,
      history,
      guardianInfo,
      emergencyContactName,
      emergencyContactNo,
      branchName,
      branchId,
    } = reqBody;

    // Convert dates to UTC with timezone handling
    const utcJoinedDate = joinedDate
      ? dayjs(joinedDate).tz(timeZone).startOf("day").utc()
      : null;
    const utcEndDate = endDate
      ? dayjs(endDate).tz(timeZone).startOf("day").utc()
      : null;
    const utcDob = dob ? dayjs(dob).tz(timeZone).startOf("day").utc() : null;

    // Convert batches dates to UTC
    const utcConvertedBatches = batches?.map((batch: any) => ({
      ...batch,
      startDate: dayjs(batch.startDate).tz(timeZone).startOf("day").utc(),
      endDate: batch?.endDate
        ? dayjs(batch.endDate).tz(timeZone).startOf("day").utc()
        : null,
    }));

    // Convert enrolledCourses dates to UTC
    const utcConvertedEnrolledCourses = enrolledCourses?.map((course: any) => ({
      ...course,
      startDate: dayjs(course.startDate).tz(timeZone).startOf("day").utc(),
      endDate: course?.endDate
        ? dayjs(course.endDate).tz(timeZone).startOf("day").utc()
        : null,
    }));

    // update HCA affiliated student
    if (affiliatedTo.toLowerCase() == "hca") {
      // check if another student with same name exists
      const existingStudent = await HcaAffiliatedStudent.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
        _id: { $ne: _id },
      });
      if (existingStudent) {
        return NextResponse.json({
          msg: "Student already exists",
          statusCode: 409,
        });
      }

      const dbStudent = await HcaAffiliatedStudent.findOne({ _id });

      // Update batches with proper date conversion
      let finalUpdatedBatches = getFinalUpdatedBatches(
        dbStudent?.batches,
        utcConvertedBatches
      );

      // Update enrolled courses with proper date conversion
      let finalUpdatedEnrolledCourses = getFinalUpdatedEnrolledCourses(
        dbStudent?.enrolledCourses,
        utcConvertedEnrolledCourses
      );

      const updatedStudent = await HcaAffiliatedStudent.findOneAndUpdate(
        { _id },
        {
          affiliatedTo,
          name,
          dob: utcDob,
          gender,
          batches: finalUpdatedBatches,
          joinedDate: utcJoinedDate,
          endDate: utcEndDate,
          address,
          phone,
          completedStatus,
          title,
          fideId,
          rating,
          guardianInfo,
          emergencyContactName,
          emergencyContactNo,
          enrolledCourses: finalUpdatedEnrolledCourses,
          branchName,
          branchId,
        },
        { new: true }
      );

      if (updatedStudent) {
        return NextResponse.json({
          msg: "Student updated",
          statusCode: 200,
          updatedStudent,
        });
      }
      return NextResponse.json({
        msg: "Student update failed",
        statusCode: 204,
      });
    }

    // update Non-affiliated student
    if (affiliatedTo.toLowerCase() == "school") {
      // check if another student with same name exists
      const existingStudent = await NonAffiliatedStudent.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
        _id: { $ne: _id },
      });
      if (existingStudent) {
        return NextResponse.json({
          msg: "Student already exists",
          statusCode: 409,
        });
      }

      const dbStudent = await NonAffiliatedStudent.findOne({ _id });

      // Update batches with proper date conversion
      let finalUpdatedBatches = getFinalUpdatedBatches(
        dbStudent?.batches,
        utcConvertedBatches
      );

      const updatedStudent = await NonAffiliatedStudent.findOneAndUpdate(
        { _id },
        {
          affiliatedTo,
          name,
          dob: utcDob,
          gender,
          batches: finalUpdatedBatches,
          joinedDate: utcJoinedDate,
          endDate: utcEndDate,
          projectId,
          projectName,
          completedStatus,
          title,
          fideId,
          rating,
        },
        { new: true }
      );

      if (updatedStudent) {
        return NextResponse.json({
          msg: "Student updated",
          statusCode: 200,
          updatedStudent,
        });
      }
      return NextResponse.json({
        msg: "Student update failed",
        statusCode: 204,
      });
    }

    return NextResponse.json({
      msg: "Student update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateStudent route", error);
    return NextResponse.json({
      msg: "Internal error in updateStudent route",
      statusCode: 500,
      error,
    });
  }
}
