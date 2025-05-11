import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsOrganizedByHca from "@/models/TournamentsOrganizedByHcaModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allTournamentsOrganizedByHca = await TournamentsOrganizedByHca.find(
      {}
    );
    if (allTournamentsOrganizedByHca) {
      return NextResponse.json({
        msg: "All Other tournaments found",
        statusCode: 200,
        allTournamentsOrganizedByHca,
      });
    }
    return NextResponse.json({
      msg: "All Other tournaments fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getallTournamentsOrganizedByHca route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getallTournamentsOrganizedByHca",
      statusCode: 204,
      error,
    });
  }
}
