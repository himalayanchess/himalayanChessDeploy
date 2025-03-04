import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Batch from "@/models/BatchModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedBatch = await Batch.findByIdAndUpdate(
      { _id: reqBody.batchId },
      { activeStatus: false }
    );

    if (deletedBatch) {
      return NextResponse.json({
        msg: "Batch deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Batch delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in deleteUser route", error);
    return NextResponse.json({
      msg: "Internal error in deleteUser route",
      statusCode: 204,
      error,
    });
  }
}
