import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournamentModel from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const lichessTournamentRecord = await LichessWeeklyTournamentModel.findById(
      reqBody?.lichessTournamentId
    );

    if (lichessTournamentRecord) {
      return NextResponse.json({
        msg: "Lichess Tournament found",
        statusCode: 200,
        lichessTournamentRecord,
      });
    }

    return NextResponse.json({
      msg: "Lichess Tournament not found",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getLichessTournament",
      statusCode: 500,
      error: error instanceof Error ? error.message : error,
    });
  }
}
