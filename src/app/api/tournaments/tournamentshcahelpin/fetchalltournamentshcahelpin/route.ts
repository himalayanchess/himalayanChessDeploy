import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsHcaHelpIn from "@/models/TournamentsHcaHelpInModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allTournamentsHcaHelpIn = await TournamentsHcaHelpIn.find({});
    if (allTournamentsHcaHelpIn) {
      return NextResponse.json({
        msg: "All tournaments hca help in found",
        statusCode: 200,
        allTournamentsHcaHelpIn,
      });
    }
    return NextResponse.json({
      msg: "All tournaments hca help in fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getallTournamentsHcaHelpIn",
      statusCode: 204,
      error,
    });
  }
}
