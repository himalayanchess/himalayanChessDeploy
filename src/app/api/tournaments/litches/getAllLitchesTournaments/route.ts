import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LitchesWeeklyTournament from "@/models/LitchesWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allLitchesTournaments = await LitchesWeeklyTournament.find({});
    if (allLitchesTournaments) {
      return NextResponse.json({
        msg: "All Litches tournaments found",
        statusCode: 200,
        allLitchesTournaments,
      });
    }
    return NextResponse.json({
      msg: "All Litches tournaments fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallLitchesTournaments route", error);
    return NextResponse.json({
      msg: "Internal error in getallLitchesTournaments",
      statusCode: 204,
      error,
    });
  }
}
