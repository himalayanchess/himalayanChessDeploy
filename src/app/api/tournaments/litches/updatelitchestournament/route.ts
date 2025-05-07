import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LitchesWeeklyTournament from "@/models/LitchesWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getFinalLitchesWinners } from "@/helpers/tournaments/getFinalLitchesWinners";

dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    const reqBody = await request.json();
    console.log("Updating Litches Tournament:", reqBody);

    // _id availabe becase of replace in frontend useEffect
    const {
      _id,
      tournamentName,
      date,
      tag,
      day,
      tournamentUrl,
      time,
      clockTime,
      branchName,
      branchId,
      tournamentType,
      weekNo,
      year,
      litchesWeeklyWinners = [],
    } = reqBody;

    const existingTournament = await LitchesWeeklyTournament.findById(_id);

    if (!existingTournament) {
      return NextResponse.json({
        msg: "Tournament not found",
        statusCode: 404,
      });
    }
    const existingSameName = await LitchesWeeklyTournament.findOne({
      _id: { $ne: _id }, // Exclude the current tournament
      tournamentName: { $regex: new RegExp(`^${tournamentName}$`, "i") }, // Case-insensitive match
      activeStatus: true,
    });

    if (existingSameName) {
      return NextResponse.json({
        msg: "Tournament name already exits",
        statusCode: 204,
      });
    }

    const finalUpdatedWinners = getFinalLitchesWinners(
      existingTournament?.litchesWeeklyWinners || [],
      litchesWeeklyWinners
    );

    const finalWinnersWithMedalPoints = finalUpdatedWinners.map(
      (winner: any) => ({
        ...winner,
        medalPoints: Math.max(11 - winner.rank, 0),
      })
    );

    const updatedTournament = await LitchesWeeklyTournament.findByIdAndUpdate(
      _id,
      {
        tournamentName,
        date,
        tag,
        day,
        tournamentUrl,
        time,
        clockTime,
        branchName,
        branchId,
        tournamentType,
        weekNo,
        year,
        litchesWeeklyWinners: finalWinnersWithMedalPoints,
      },
      { new: true }
    );

    return NextResponse.json({
      msg: "Tournament updated successfully",
      statusCode: 200,
      updatedTournament,
    });
  } catch (error) {
    console.error("Error updating Litches tournament:", error);
    return NextResponse.json({
      msg: "Internal server error",
      statusCode: 500,
      error,
    });
  }
}
