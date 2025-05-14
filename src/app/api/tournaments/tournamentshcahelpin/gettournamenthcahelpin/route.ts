import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsHcaHelpIn from "@/models/TournamentsHcaHelpInModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const tournamentHcaHelpInRecord = await TournamentsHcaHelpIn.findById(
      reqBody?.tournamentHcaHelpInId
    );

    if (tournamentHcaHelpInRecord) {
      return NextResponse.json({
        msg: "Tournament Hca help in found",
        statusCode: 200,
        tournamentHcaHelpInRecord,
      });
    }

    return NextResponse.json({
      msg: "Tournament Hca help in not found",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getTournamentsHcaHelpIn",
      statusCode: 500,
      error: error instanceof Error ? error.message : error,
    });
  }
}
