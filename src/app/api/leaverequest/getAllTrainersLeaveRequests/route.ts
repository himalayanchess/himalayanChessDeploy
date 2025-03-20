import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LeaveRequest from "@/models/LeaveRequestModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    console.log("getting leave data", reqBody);

    const allTrainersLeaveRequests = await LeaveRequest.find({
      trainerId: reqBody?.trainerId,
    });
    if (allTrainersLeaveRequests) {
      return NextResponse.json({
        msg: "All leave requests found",
        statusCode: 200,
        allTrainersLeaveRequests,
      });
    }
    return NextResponse.json({
      msg: "Fetching all leave requests failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallTrainersLeaveRequests route", error);
    return NextResponse.json({
      msg: "Internal error in getallTrainersLeaveRequests",
      statusCode: 204,
      error,
    });
  }
}
