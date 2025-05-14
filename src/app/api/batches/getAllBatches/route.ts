import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Batch from "@/models/BatchModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allBatches = await Batch.find({});
    if (allBatches) {
      return NextResponse.json({
        msg: "All batches found",
        statusCode: 200,
        allBatches,
      });
    }
    return NextResponse.json({
      msg: "All batches fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallBatches",
      statusCode: 204,
      error,
    });
  }
}
