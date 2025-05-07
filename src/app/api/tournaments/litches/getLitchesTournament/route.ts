import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LitchesWeeklyTournamentModel from "@/models/LitchesWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const litchesTournamentRecord = await LitchesWeeklyTournamentModel.findById(reqBody?.litchesTournamentId);

    if (litchesTournamentRecord) {
      return NextResponse.json({
        msg: "Litches Tournament found",
        statusCode: 200,
        litchesTournamentRecord,
      });
    }

    return NextResponse.json({
      msg: "Litches Tournament not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getLitchesTournament route", error);
    return NextResponse.json({
      msg: "Internal error in getLitchesTournament",
      statusCode: 500,
      error: error instanceof Error ? error.message : error,
    });
  }
}
