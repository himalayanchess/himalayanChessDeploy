import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Branch from "@/models/BranchModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // add role verification
    const deletedBranch = await Branch.findByIdAndUpdate(
      { _id: reqBody.branchId },
      { activeStatus: false }
    );

    if (deletedBranch) {
      return NextResponse.json({
        msg: "Branch deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Branch delete failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in deleteBranch route", error);
    return NextResponse.json({
      msg: "Internal error in deleteBranch route",
      statusCode: 204,
      error,
    });
  }
}
