import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const allSelectedStudentsLichessTournaments: any =
      await LichessWeeklyTournament.find({
        lichessWeeklyWinners: {
          $elemMatch: {
            studentId: reqBody?.studentId,
          },
        },
      });

    if (allSelectedStudentsLichessTournaments) {
      return NextResponse.json({
        msg: "Selected students lichess tournaments found",
        statusCode: 200,
        allSelectedStudentsLichessTournaments,
      });
    }
    console.log(allSelectedStudentsLichessTournaments);

    return NextResponse.json({
      msg: "Selected students lichess tournaments not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getSelected students lichess tournaments route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getSelected students lichess tournaments",
      statusCode: 204,
      error,
    });
  }
}
