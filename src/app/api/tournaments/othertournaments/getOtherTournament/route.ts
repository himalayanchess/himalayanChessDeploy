import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import OtherTournament from "@/models/OtherTournamentsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const otherTournamentRecord = await OtherTournament.findById(
      reqBody?.otherTournamentId
    );

    if (otherTournamentRecord) {
      return NextResponse.json({
        msg: "Other Tournament found",
        statusCode: 200,
        otherTournamentRecord,
      });
    }

    return NextResponse.json({
      msg: "Other Tournament not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getOtherTournament route", error);
    return NextResponse.json({
      msg: "Internal error in getOtherTournament",
      statusCode: 500,
      error: error instanceof Error ? error.message : error,
    });
  }
}
