import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TestHistory from "@/models/TestHistoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allTestHistories = await TestHistory.find({});
    if (allTestHistories) {
      return NextResponse.json({
        msg: "All Test History found",
        statusCode: 200,
        allTestHistories,
      });
    }
    return NextResponse.json({
      msg: "All Test History fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallTestHistories",
      statusCode: 204,
      error,
    });
  }
}
