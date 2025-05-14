import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TestHistory from "@/models/TestHistoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedTestRecord = await TestHistory.findByIdAndUpdate(
      { _id: reqBody.testRecordId },
      { activeStatus: false }
    );

    if (deletedTestRecord) {
      return NextResponse.json({
        msg: "Test Record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Test Record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteTest Record route",
      statusCode: 204,
      error,
    });
  }
}
