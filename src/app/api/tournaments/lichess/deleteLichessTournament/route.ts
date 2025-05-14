import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedLichessTournament =
      await LichessWeeklyTournament.findByIdAndUpdate(
        { _id: reqBody.lichessTournamentId },
        { activeStatus: false }
      );

    if (deletedLichessTournament) {
      return NextResponse.json({
        msg: "Lichess record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Lichess record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteLichess record route",
      statusCode: 204,
      error,
    });
  }
}
