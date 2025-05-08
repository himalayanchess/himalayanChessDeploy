import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getFinalLichessWinners } from "@/helpers/tournaments/getFinalLichessWinners";

dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    const reqBody = await request.json();
    console.log("Updating Lichess Tournament:", reqBody);

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
      lichessWeeklyWinners = [],
    } = reqBody;

    const existingTournament = await LichessWeeklyTournament.findById(_id);

    if (!existingTournament) {
      return NextResponse.json({
        msg: "Tournament not found",
        statusCode: 404,
      });
    }
    const existingSameName = await LichessWeeklyTournament.findOne({
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

    const finalUpdatedWinners = getFinalLichessWinners(
      existingTournament?.lichessWeeklyWinners || [],
      lichessWeeklyWinners
    );

    const finalWinnersWithMedalPoints = finalUpdatedWinners.map(
      (winner: any) => ({
        ...winner,
        medalPoints: Math.max(11 - winner.rank, 0),
      })
    );

    const updatedTournament = await LichessWeeklyTournament.findByIdAndUpdate(
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
        lichessWeeklyWinners: finalWinnersWithMedalPoints,
      },
      { new: true }
    );

    return NextResponse.json({
      msg: "Tournament updated successfully",
      statusCode: 200,
      updatedTournament,
    });
  } catch (error) {
    console.error("Error updating Lichess tournament:", error);
    return NextResponse.json({
      msg: "Internal server error",
      statusCode: 500,
      error,
    });
  }
}
