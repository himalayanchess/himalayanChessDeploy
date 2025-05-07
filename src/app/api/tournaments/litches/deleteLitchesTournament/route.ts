import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LitchesWeeklyTournament from "@/models/LitchesWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedLitchesTournament =
      await LitchesWeeklyTournament.findByIdAndUpdate(
        { _id: reqBody.litchesTournamentId },
        { activeStatus: false }
      );

    if (deletedLitchesTournament) {
      return NextResponse.json({
        msg: "Litches record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Litches record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in deleteLitches record route", error);
    return NextResponse.json({
      msg: "Internal error in deleteLitches record route",
      statusCode: 204,
      error,
    });
  }
}
