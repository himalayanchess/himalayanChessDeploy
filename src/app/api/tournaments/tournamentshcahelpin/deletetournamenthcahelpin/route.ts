import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsHcaHelpIn from "@/models/TournamentsHcaHelpInModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedTournamentHcaHelpIn =
      await TournamentsHcaHelpIn.findByIdAndUpdate(
        { _id: reqBody.tournamentId },
        { activeStatus: false }
      );

    if (deletedTournamentHcaHelpIn) {
      return NextResponse.json({
        msg: "Tournament record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Tournament hca help in record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in delete tournament hca help in record route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in delete tournament hca help in record route",
      statusCode: 204,
      error,
    });
  }
}
