import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaCircuitSeriesTournament from "@/models/HcaCircuitSeriesModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const hcaCircuitSeriesTournamentRecord =
      await HcaCircuitSeriesTournament.findById(
        reqBody?.hcaCircuitSeriesTournamentId
      );

    if (hcaCircuitSeriesTournamentRecord) {
      return NextResponse.json({
        msg: "Hca Circuit series Tournament found",
        statusCode: 200,
        hcaCircuitSeriesTournamentRecord,
      });
    }
   

    return NextResponse.json({
      msg: "hca Circuit series  Tournament not found",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in gethca Circuit series Tournament route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in gethca Circuit series Tournament",
      statusCode: 500,
      error: error instanceof Error ? error.message : error,
    });
  }
}
