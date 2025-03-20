import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LeaveRequest from "@/models/LeaveRequestModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedleaveRequest = await LeaveRequest.findByIdAndUpdate(
      { _id: reqBody._id },
      { activeStatus: false }
    );

    if (deletedleaveRequest) {
      return NextResponse.json({
        msg: "Leave Request deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Leave Request delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in deleteleaveRequest route", error);
    return NextResponse.json({
      msg: "Internal error in deleteleaveRequest route",
      statusCode: 204,
      error,
    });
  }
}
