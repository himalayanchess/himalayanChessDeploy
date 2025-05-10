import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import OtherTournament from "@/models/OtherTournamentsModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allOtherTournaments = await OtherTournament.find({});
    if (allOtherTournaments) {
      return NextResponse.json({
        msg: "All Other tournaments found",
        statusCode: 200,
        allOtherTournaments,
      });
    }
    return NextResponse.json({
      msg: "All Other tournaments fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallOtherTournaments route", error);
    return NextResponse.json({
      msg: "Internal error in getallOtherTournaments",
      statusCode: 204,
      error,
    });
  }
}
