import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsHcaHelpIn from "@/models/TournamentsHcaHelpInModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const allSelectedStudentsTournamentsHcaHelpIn: any =
      await TournamentsHcaHelpIn.find({
        participants: {
          $elemMatch: {
            studentId: reqBody?.studentId,
            activeStatus: true,
          },
        },
      });

    if (allSelectedStudentsTournamentsHcaHelpIn) {
      return NextResponse.json({
        msg: "Selected students tournaments hca help in found",
        statusCode: 200,
        allSelectedStudentsTournamentsHcaHelpIn,
      });
    }

    return NextResponse.json({
      msg: "Selected students  tournaments hca help in not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getSelected students  tournaments hca help in route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getSelected students  tournaments org by hca",
      statusCode: 204,
      error,
    });
  }
}
