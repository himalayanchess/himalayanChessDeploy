import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LeaveRequest from "@/models/LeaveRequestModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let leaveRequestRecord = await LeaveRequest.findById(
      reqBody?.leaveRequestId
    );

    if (leaveRequestRecord) {
      return NextResponse.json({
        msg: "Batch found",
        statusCode: 200,
        leaveRequestRecord,
      });
    }

    return NextResponse.json({
      msg: "Batch not found",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getBatch",
      statusCode: 204,
      error,
    });
  }
}
