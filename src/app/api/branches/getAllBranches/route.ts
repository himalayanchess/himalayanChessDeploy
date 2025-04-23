import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Branch from "@/models/BranchModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allBranches = await Branch.find({});
    if (allBranches) {
      return NextResponse.json({
        msg: "All Branches found",
        statusCode: 200,
        allBranches,
      });
    }
    return NextResponse.json({
      msg: "All Branches fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getAllBranches route", error);
    return NextResponse.json({
      msg: "Internal error in getAllBranches",
      statusCode: 204,
      error,
    });
  }
}
