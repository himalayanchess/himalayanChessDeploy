import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedClass = await ActivityRecord.findByIdAndUpdate(
      { _id: reqBody._id },
      { activeStatus: false }
    );

    if (deletedClass) {
      return NextResponse.json({
        msg: "Class deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Class delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in deleteClass route", error);
    return NextResponse.json({
      msg: "Internal error in deleteClass route",
      statusCode: 204,
      error,
    });
  }
}
