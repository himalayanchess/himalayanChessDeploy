import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Batch from "@/models/BatchModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let batchRecord = await Batch.findById(reqBody?.batchId);

    if (batchRecord) {
      return NextResponse.json({
        msg: "Batch found",
        statusCode: 200,
        batchRecord,
      });
    }

    return NextResponse.json({
      msg: "Batch not found",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getBatch",
      statusCode: 204,
      error,
    });
  }
}
