import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LeaveRequest from "@/models/LeaveRequestModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    console.log("inside get all leave request");

    const allLeaveRequests = await LeaveRequest.find({});
    if (allLeaveRequests) {
      return NextResponse.json({
        msg: "All leave requests found",
        statusCode: 200,
        allLeaveRequests,
      });
    }
    return NextResponse.json({
      msg: "Fetching all leave requests failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallLeaveRequests route", error);
    return NextResponse.json({
      msg: "Internal error in getallLeaveRequests",
      statusCode: 204,
      error,
    });
  }
}
