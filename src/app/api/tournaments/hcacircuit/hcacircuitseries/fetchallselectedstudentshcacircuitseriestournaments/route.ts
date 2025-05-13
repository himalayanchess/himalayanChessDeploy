import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaCircuitSeriesTournament from "@/models/HcaCircuitSeriesModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const allSelectedStudentsHcaCircuitSeriesTournaments: any =
      await HcaCircuitSeriesTournament.find({
        participants: {
          $elemMatch: {
            studentId: reqBody?.studentId,
            activeStatus: true,
          },
        },
      });

    if (allSelectedStudentsHcaCircuitSeriesTournaments) {
      return NextResponse.json({
        msg: "Selected students hca circuit series tournaments found",
        statusCode: 200,
        allSelectedStudentsHcaCircuitSeriesTournaments,
      });
    }
    // console.log(allSelectedStudentsHcaCircuitSeriesTournaments);

    return NextResponse.json({
      msg: "Selected students hca circuit series tournaments not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getSelected students hca circuit series tournaments route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getSelected students hca circuit series tournaments",
      statusCode: 204,
      error,
    });
  }
}
