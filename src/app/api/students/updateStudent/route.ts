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

      const dbStudent = await HcaAffiliatedStudent.findOne({ _id });
      console.log("passedBatches", batches);
      console.log("database student", dbStudent.batches);

      let finalBatches = JSON.parse(JSON.stringify(dbStudent?.batches || [])); // Prevents Mongoose issues
      // Update existing records and add new ones
      batches.forEach((passedBatch) => {
        const index = finalBatches.findIndex(
          (student) => student.batchId === passedBatch.batchId
        );

        if (index !== -1) {
          // If batch exists, update it
          finalBatches[index] = passedBatch;
        } else {
          // If batch does not exist, add it
          finalBatches.push(passedBatch);
        }
      });

      // Mark inactive batches (present in dbStudents but not in passedBatches)
      finalBatches = finalBatches.map((batch) => {
        const existsInPassed = batches.some(
          (passedBatch) => passedBatch.batchId === batch.batchId
        );
        if (!existsInPassed) {
          return { ...batch, activeStatus: false };
        }
        return batch;
      });

      console.log("finalBatches", finalBatches);

      const updatedStudent = await HcaAffiliatedStudent.findOneAndUpdate(
        {
          _id,
        },
        {
          affiliatedTo,
          name,
          dob,
          gender,
          batches: finalBatches,
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
          batches,
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
