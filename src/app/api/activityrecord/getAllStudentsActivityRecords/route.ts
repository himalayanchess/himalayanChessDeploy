import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import ActivityRecord from "@/models/ActivityRecordModel";
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

    const allStudentsActivityRecords = await ActivityRecord.aggregate([
      // 1. Find records containing this student
      { $match: { "studentRecords._id": studentId } },

      // 2. Transform - keep all fields but filter studentRecords
      {
        $addFields: {
          studentRecords: {
            $filter: {
              input: "$studentRecords",
              as: "record",
              cond: { $eq: ["$$record._id", studentId] },
            },
          },
        },
      },
    ]);

    return NextResponse.json({
      msg: "Student Activity records found",
      statusCode: 200,
      allStudentsActivityRecords,
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: "Internal error in getAllStudentsActivityRecords route",
      statusCode: 204,
      error,
    });
  }
}
