import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsOrganizedByHca from "@/models/TournamentsOrganizedByHcaModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const allSelectedStudentsTournamentsOrganizedByHca: any =
      await TournamentsOrganizedByHca.find({
        participants: {
          $elemMatch: {
            studentId: reqBody?.studentId,
            activeStatus: true,
          },
        },
      });

    if (allSelectedStudentsTournamentsOrganizedByHca) {
      return NextResponse.json({
        msg: "Selected students tournaments org by hca found",
        statusCode: 200,
        allSelectedStudentsTournamentsOrganizedByHca,
      });
    }
    // console.log(allSelectedStudentsTournamentsOrganizedByHca);

    return NextResponse.json({
      msg: "Selected students  tournaments org by hca not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getSelected students  tournaments org by hca route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getSelected students  tournaments org by hca",
      statusCode: 204,
      error,
    });
  }
}
