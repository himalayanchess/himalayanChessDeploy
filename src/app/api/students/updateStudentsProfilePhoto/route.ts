import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { sendLeaveRequestResponseMail } from "@/helpers/nodemailer/nodemailer";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { studentId, editedProfilePhotoUrl } = reqBody;
    console.log("update profile photo ", reqBody);

    const updatedStudent = await HcaAffiliatedStudent.findOneAndUpdate(
      { _id: studentId },
      {
        imageUrl: editedProfilePhotoUrl,
      },
      { new: true }
    );
    if (updatedStudent) {
      return NextResponse.json({
        msg: "Profile photo updated",
        statusCode: 200,
        updatedStudent,
      });
    }
    return NextResponse.json({
      msg: "Failed to update profile photo",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateStudentsProfilePhoto route", error);
    return NextResponse.json({
      msg: "Internal error in updateStudentsProfilePhoto route",
      statusCode: 204,
      error,
    });
  }
}
