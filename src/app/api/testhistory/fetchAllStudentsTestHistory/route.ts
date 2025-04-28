import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TestHistory from "@/models/TestHistoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();
    await dbconnect();

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    const allStudentsTestHistory = await TestHistory.find({
      activeStatus: true,
      studentId: studentId,
    });
    if (allStudentsTestHistory) {
      return NextResponse.json({
        msg: "Student test history found",
        statusCode: 200,
        allStudentsTestHistory,
      });
    }
    return NextResponse.json({
      msg: "Failed to fetch test history of student",
      statusCode: 204,
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: "Internal error in fetchAllStudentsTestHistory route",
      statusCode: 204,
      error,
    });
  }
}
