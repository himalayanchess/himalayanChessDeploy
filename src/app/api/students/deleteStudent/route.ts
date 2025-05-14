import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import Project from "@/models/ProjectModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { studentId, affiliatedTo } = reqBody;

    // find and update from different schema based on affiliatedTo (HCA,School)
    // hca
    if (affiliatedTo.toLowerCase() == "hca") {
      const deletedStudent = await HcaAffiliatedStudent.findByIdAndUpdate(
        { _id: studentId },
        { activeStatus: false },
        { new: true } // This ensures the updated document is returned
      );
      if (deletedStudent) {
        return NextResponse.json({
          msg: "Student deleted",
          statusCode: 200,
        });
      }
    }
    // School
    else if (affiliatedTo.toLowerCase() == "school") {
      const deletedStudent = await NonAffiliatedStudent.findByIdAndUpdate(
        { _id: studentId },
        { activeStatus: false },
        { new: true } // This ensures the updated document is returned
      );
      if (deletedStudent) {
        return NextResponse.json({
          msg: "Student deleted",
          statusCode: 200,
        });
      }
    }
    return NextResponse.json({
      msg: "Project failed to delete",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteProject route",
      statusCode: 204,
      error,
    });
  }
}
