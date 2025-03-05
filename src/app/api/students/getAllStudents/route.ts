import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Batch from "@/models/BatchModel";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allHcaAffiliatedStudents = await HcaAffiliatedStudent.find({});
    const allNonAffiliatedStudents = await NonAffiliatedStudent.find({});
    if (allHcaAffiliatedStudents && allNonAffiliatedStudents) {
      return NextResponse.json({
        msg: "All students found",
        statusCode: 200,
        allHcaAffiliatedStudents,
        allNonAffiliatedStudents,
      });
    }
    return NextResponse.json({
      msg: "All students fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getAllStudents route", error);
    return NextResponse.json({
      msg: "Internal error in getAllStudents",
      statusCode: 204,
      error,
    });
  }
}
