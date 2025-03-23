import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let studentRecord = await HcaAffiliatedStudent.findById(reqBody?.studentId);

    // If not found in HCAStudents, check NonAffiliatedStudents
    if (!studentRecord) {
      studentRecord = await NonAffiliatedStudent.findById(reqBody?.studentId);
    }

    if (studentRecord) {
      return NextResponse.json({
        msg: "Student found",
        statusCode: 200,
        studentRecord,
      });
    }
    return NextResponse.json({
      msg: "Student not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getStudent route", error);
    return NextResponse.json({
      msg: "Internal error in getStudent",
      statusCode: 204,
      error,
    });
  }
}
