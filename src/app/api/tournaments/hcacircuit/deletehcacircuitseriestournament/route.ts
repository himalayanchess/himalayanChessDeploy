import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaCircuitSeriesTournament from "@/models/HcaCircuitSeriesModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedHcaCircuitSeriesTournament =
      await HcaCircuitSeriesTournament.findByIdAndUpdate(
        { _id: reqBody.hcaCircuitSeriesTournamentId },
        { activeStatus: false }
      );

    if (deletedHcaCircuitSeriesTournament) {
      return NextResponse.json({
        msg: "HcaCircuit Series tournament record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "HcaCircuit Series tournament record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in deleteHcaCircuit Series tournament record route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in deleteHcaCircuit Series tournament record route",
      statusCode: 204,
      error,
    });
  }
}
