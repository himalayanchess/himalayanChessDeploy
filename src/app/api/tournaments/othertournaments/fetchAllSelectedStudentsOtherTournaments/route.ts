import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import OtherTournament from "@/models/OtherTournamentsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const allSelectedStudentsOtherTournaments: any = await OtherTournament.find(
      {
        participants: {
          $elemMatch: {
            studentId: reqBody?.studentId,
            activeStatus: true,
          },
        },
      }
    );

    if (allSelectedStudentsOtherTournaments) {
      return NextResponse.json({
        msg: "Selected students other tournaments found",
        statusCode: 200,
        allSelectedStudentsOtherTournaments,
      });
    }

    return NextResponse.json({
      msg: "Selected students other tournaments not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getSelected students other tournaments route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getSelected students other tournaments",
      statusCode: 204,
      error,
    });
  }
}
