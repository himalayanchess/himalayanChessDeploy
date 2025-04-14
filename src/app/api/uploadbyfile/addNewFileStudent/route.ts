import { dbconnect } from "@/helpers/dbconnect/dbconnect";

import { NextRequest, NextResponse } from "next/server";
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";
    const reqBody = await request.formData();
    const file = reqBody.get("file") as File;
    // Read the file content using Buffer
    const fileBuffer = await file.arrayBuffer(); // Convert the file to ArrayBuffer
    const fileContent = Buffer.from(fileBuffer).toString("utf-8"); // Convert ArrayBuffer to string (utf-8)

    // Parse the content as JSON
    const parsedStudentData = JSON.parse(fileContent);
    const {
      affiliatedTo = "", // required
      name = "", // required
      dob = null, // required
      gender = "", // required
      educationalInstitute = "",

      joinedDate = null, // required
      endDate = null,
      address = "", // required
      phone = "",
      projectId = "",
      projectName = "",
      completedStatus = false, // required   enum: ["Ongoing", "Left"],

      title = "",
      fideId = 0,
      rating = 0,

      guardianInfo = null, // required for hca student (name,phone,email)
      emergencyContactName = "", // required for hca student
      emergencyContactNo = "", // required for hca student

      batches = [],
      enrolledCourses = [],
      eventsPlayed = [],
      history = [],
    } = parsedStudentData;

    // check for mandatory values
    // (affiliatedTo, name, dob, gender, )
    if (
      !affiliatedTo ||
      !name ||
      !dob ||
      !gender ||
      !joinedDate ||
      !address ||
      !completedStatus
    ) {
      return NextResponse.json({
        msg: "Mandatory fields not satisfied",
        statusCode: 204,
      });
    }

    // if affiliated to then guardian info necessary
    if (affiliatedTo?.toLowerCase() == "hca" && !guardianInfo) {
      return NextResponse.json({
        msg: "Guardian info necessary for hca student",
        statusCode: 204,
      });
    }
    // if affiliated to then (emergencyContactName,emergencyContactNo) info necessary
    if (
      affiliatedTo?.toLowerCase() == "hca" &&
      (!emergencyContactName || !emergencyContactNo)
    ) {
      return NextResponse.json({
        msg: "Emergency contact name and number necessary for hca student",
        statusCode: 204,
      });
    }

    // main function start
    const utcJoinedDate = dayjs(dob).tz(timeZone).startOf("day").utc();
    const utcEndDate = dayjs(dob).tz(timeZone).startOf("day").utc();
    const utcDob = dayjs(dob).tz(timeZone).startOf("day").utc();

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
      name: { $regex: new RegExp(`^${name}$`, "i") },
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
    if (affiliatedTo?.toLowerCase() == "hca") {
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
    // add student accoring to affiliatedTo (school)
    if (affiliatedTo?.toLowerCase() == "school") {
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
    console.log("Internal error in getallBatches route", error);
    return NextResponse.json({
      msg: "Internal error in getallBatches",
      statusCode: 204,
      error,
    });
  }
}
