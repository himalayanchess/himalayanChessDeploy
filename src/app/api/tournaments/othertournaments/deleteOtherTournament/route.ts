import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import OtherTournament from "@/models/OtherTournamentsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedOtherTournament = await OtherTournament.findByIdAndUpdate(
      { _id: reqBody.otherTournamentId },
      { activeStatus: false }
    );

    if (deletedOtherTournament) {
      return NextResponse.json({
        msg: "Other tournament record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Other tournament record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deleteOther tournament record route",
      statusCode: 204,
      error,
    });
  }
}
