import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaCircuitTournament from "@/models/HcaCircuitTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allHcaCircuitTournaments = await HcaCircuitTournament.find({});
    if (allHcaCircuitTournaments) {
      return NextResponse.json({
        msg: "All Hca circuit tournaments found",
        statusCode: 200,
        allHcaCircuitTournaments,
      });
    }
    return NextResponse.json({
      msg: "All Hca circuit tournaments fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallHcaCircuitTournaments",
      statusCode: 204,
      error,
    });
  }
}
