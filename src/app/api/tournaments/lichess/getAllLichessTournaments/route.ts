import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allLichessTournaments = await LichessWeeklyTournament.find({});
    if (allLichessTournaments) {
      return NextResponse.json({
        msg: "All Lichess tournaments found",
        statusCode: 200,
        allLichessTournaments,
      });
    }
    return NextResponse.json({
      msg: "All Lichess tournaments fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallLichessTournaments route", error);
    return NextResponse.json({
      msg: "Internal error in getallLichessTournaments",
      statusCode: 204,
      error,
    });
  }
}
