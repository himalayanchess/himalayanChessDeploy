import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
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
      batchId,
      batchName,
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
    } = reqBody;

    // update HCA affiliated student
    if (affiliatedTo.toLowerCase() == "hca") {
      // check if another student with same name exists
      const existingStudent = await HcaAffiliatedStudent.findOne({
        name: { $regex: `^${name}$`, $options: "i" }, // Case-insensitive search
        _id: { $ne: _id }, // Exclude the current student
      });
      if (existingStudent) {
        return NextResponse.json({
          msg: "Student already exists",
          statusCode: 409, // Conflict status
        });
      }
      const updatedStudent = await HcaAffiliatedStudent.findOneAndUpdate(
        {
          _id,
        },
        {
          affiliatedTo,
          name,
          dob,
          gender,
          batchId,
          batchName,
          joinedDate,
          endDate,
          address,
          phone,
          completedStatus,
          title,
          fideId,
          rating,
          guardianInfo,
          emergencyContactName,
          emergencyContactNo,
          enrolledCourses,
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
    // update Non  affiliated student
    if (affiliatedTo.toLowerCase() == "school") {
      // check if another student with same name exists
      const existingStudent = await NonAffiliatedStudent.findOne({
        name: { $regex: `^${name}$`, $options: "i" }, // Case-insensitive search
        _id: { $ne: _id }, // Exclude the current student
      });
      if (existingStudent) {
        return NextResponse.json({
          msg: "Student already exists",
          statusCode: 409, // Conflict status
        });
      }
      const updatedStudent = await NonAffiliatedStudent.findOneAndUpdate(
        {
          _id,
        },
        {
          affiliatedTo,
          name,
          dob,
          gender,
          batchId,
          batchName,
          joinedDate,
          endDate,
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
      statusCode: 204,
      error,
    });
  }
}
