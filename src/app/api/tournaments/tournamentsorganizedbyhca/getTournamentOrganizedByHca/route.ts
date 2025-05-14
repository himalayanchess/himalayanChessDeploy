import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import TournamentsOrganizedByHca from "@/models/TournamentsOrganizedByHcaModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const tournamentOrganizedByHcaRecord =
      await TournamentsOrganizedByHca.findById(
        reqBody?.tournamentOrganizedByHcaId
      );

    if (tournamentOrganizedByHcaRecord) {
      return NextResponse.json({
        msg: "Tournament Org By Hca found",
        statusCode: 200,
        tournamentOrganizedByHcaRecord,
      });
    }

    return NextResponse.json({
      msg: "Tournament Org By Hca not found",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getTournamentOrgByhca",
      statusCode: 500,
      error: error instanceof Error ? error.message : error,
    });
  }
}
