import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LeaveRequest from "@/models/LeaveRequestModel";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    console.log("update leave request ", reqBody);

    const updatedLeaveRequest = await LeaveRequest.findOneAndUpdate(
      { _id: reqBody._id },
      reqBody,
      { new: true }
    );
    if (updatedLeaveRequest) {
      return NextResponse.json({
        msg: "LeaveRequest updated",
        statusCode: 200,
        updatedLeaveRequest,
      });
    }
    return NextResponse.json({
      msg: "LeaveRequest update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateLeaveRequest route", error);
    return NextResponse.json({
      msg: "Internal error in updateLeaveRequest route",
      statusCode: 204,
      error,
    });
  }
}
