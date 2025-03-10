import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import NonAffiliatedStudent from "@/models/NonAffiliatedStudentModel";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
export async function POST(req: NextRequest) {
  try {
    await dbconnect();
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
      selectedAffiliatedTo,
    } = reqBody;

    // Check if user with the same name exists (case-insensitive)
    const nonAffiliatedStudentExists = await NonAffiliatedStudent.findOne({
      name: { $regex: new RegExp(`^${reqBody.name}$`, "i") },
    });

    const hcaAffiliatedStudentExists = await HcaAffiliatedStudent.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (nonAffiliatedStudentExists || hcaAffiliatedStudentExists) {
      return NextResponse.json({ msg: "User already exists", statusCode: 204 });
    }

    // add student accoring to selectedAffiliatedTo (hca)
    if (selectedAffiliatedTo?.toLowerCase() == "hca") {
      console.log(reqBody);

      // const newStudent = new HcaAffiliatedStudent({
      //   affiliatedTo,
      //   name,
      //   dob,
      //   gender,
      //   batchId,
      //   batchName,
      //   joinedDate,
      //   endDate,
      //   address,
      //   phone,
      //   completedStatus,
      //   title,
      //   fideId,
      //   rating,
      //   guardianInfo,
      //   emergencyContactName,
      //   emergencyContactNo,
      //   enrolledCourses,
      // });
      // const savedNewStudent = await newStudent.save();
      // if (savedNewStudent) {
      //   return NextResponse.json({
      //     statusCode: 200,
      //     msg: "New Student added",
      //     savedNewStudent,
      //   });
      // }
      return NextResponse.json({
        statusCode: 200,
        msg: "New Student added",
        // savedNewStudent,
      });
    }
    // add student accoring to selectedAffiliatedTo (school)
    if (selectedAffiliatedTo?.toLowerCase() == "school") {
      const newStudent = new NonAffiliatedStudent({
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
      });
      const savedNewStudent = await newStudent.save();
      if (savedNewStudent) {
        return NextResponse.json({
          statusCode: 200,
          msg: "New Student added",
          savedNewStudent,
        });
      }
    }

    // }
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
