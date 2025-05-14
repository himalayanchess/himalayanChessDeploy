import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaCircuitTournament from "@/models/HcaCircuitTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const hcaCircuitTournamentRecord = await HcaCircuitTournament.findById(
      reqBody?.hcaCircuitTournamentId
    );

    if (hcaCircuitTournamentRecord) {
      return NextResponse.json({
        msg: "Hca Circuit Tournament found",
        statusCode: 200,
        hcaCircuitTournamentRecord,
      });
    }

    return NextResponse.json({
      msg: "hca Circuit  Tournament not found",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in gethca Circuit Tournament",
      statusCode: 500,
      error: error instanceof Error ? error.message : error,
    });
  }
}
