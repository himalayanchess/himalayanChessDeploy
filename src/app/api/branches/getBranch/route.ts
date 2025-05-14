import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Branch from "@/models/BranchModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let branchRecord = await Branch.findById(reqBody?.branchId);

    if (branchRecord) {
      return NextResponse.json({
        msg: "Batch found",
        statusCode: 200,
        branchRecord,
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
