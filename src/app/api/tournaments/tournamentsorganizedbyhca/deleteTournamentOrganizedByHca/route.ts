import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsOrganizedByHca from "@/models/TournamentsOrganizedByHcaModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedTournamentOrganizedByHca =
      await TournamentsOrganizedByHca.findByIdAndUpdate(
        { _id: reqBody.tournamentId },
        { activeStatus: false }
      );

    if (deletedTournamentOrganizedByHca) {
      return NextResponse.json({
        msg: "Tournament record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Tournament org by hca record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in delete tournament org by hca record route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in delete tournament org by hca record route",
      statusCode: 204,
      error,
    });
  }
}
