import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaCircuitSeriesTournament from "@/models/HcaCircuitSeriesModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const allMainHcaCircuitSeriesTournaments: any =
      await HcaCircuitSeriesTournament.find({
        mainHcaCircuitTournamentId: reqBody?.mainHcaCircuitTournamentId,
      });

    if (allMainHcaCircuitSeriesTournaments) {
      return NextResponse.json({
        msg: "Selected main hca circuit series tournaments found",
        statusCode: 200,
        allMainHcaCircuitSeriesTournaments,
      });
    }
    // console.log(allMainHcaCircuitSeriesTournaments);

    return NextResponse.json({
      msg: "Selected main hca circuit series tournaments not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getSelected main hca circuit series tournaments route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getSelected main hca circuit series tournaments",
      statusCode: 204,
      error,
    });
  }
}
