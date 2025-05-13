import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaCircuitTournament from "@/models/HcaCircuitTournamentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedHcaCircuitTournament =
      await HcaCircuitTournament.findByIdAndUpdate(
        { _id: reqBody.hcaCircuitTournamentId },
        { activeStatus: false }
      );

    if (deletedHcaCircuitTournament) {
      return NextResponse.json({
        msg: "HcaCircuit tournament record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "HcaCircuit tournament record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in deleteHcaCircuit tournament record route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in deleteHcaCircuit tournament record route",
      statusCode: 204,
      error,
    });
  }
}
