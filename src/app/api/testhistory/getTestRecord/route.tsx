import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TestHistory from "@/models/TestHistoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let testRecord = await TestHistory.findById(reqBody?.testRecordId);

    if (testRecord) {
      return NextResponse.json({
        msg: "Test Record found",
        statusCode: 200,
        testRecord,
      });
    }
    console.log(testRecord);

    return NextResponse.json({
      msg: "TestRecord not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getTestRecord route", error);
    return NextResponse.json({
      msg: "Internal error in getTestRecord",
      statusCode: 204,
      error,
    });
  }
}
