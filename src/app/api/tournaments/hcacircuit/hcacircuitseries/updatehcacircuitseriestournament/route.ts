import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import HcaCircuitSeriesTournament from "@/models/HcaCircuitSeriesModel";
import { getFinalHcaCircuitParticipants } from "@/helpers/tournaments/getFinalHcaCircuitSeriesParticipants";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(isoWeek);
dayjs.extend(weekday);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();

    const reqBody = await request.json();
    // console.log("updating hca serues tournamte", reqBody);

    const {
      _id,
      mainHcaCircuitTournamentId,
      mainHcaCircuitTournamentName,
      tournamentName,
      tournamentUrl,
      tag,

      startDate, // from input[type=date], like "2025-04-14"
      endDate,
      branchName,
      branchId,
      tournamentType,

      initialTime,
      increment,

      totalParticipants,
      totalRounds,

      chiefArbiter,

      isRated,
      fideUrl,
      chessResultsUrl,

      participants = [],
    } = reqBody;

    // Case-insensitive check for duplicate tournament
    const existingTournament = await HcaCircuitSeriesTournament.findById(_id);

    if (!existingTournament) {
      return NextResponse.json({
        msg: "Tournament not found",
        statusCode: 404,
      });
    }

    const existingSameName = await HcaCircuitSeriesTournament.findOne({
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

    const isoStartDate = startDate ? dayjs(startDate).utc().toDate() : "";
    const isoEndDate = endDate ? dayjs(endDate).utc().toDate() : "";

    const clockTime = {
      initialTime, // initial time in minutes
      increment, // increment time in seconds
    };

    const finalUpdatedParticipants = getFinalHcaCircuitParticipants(
      existingTournament?.participants || [],
      participants
    );

    // update circuitPoints form updated participants its rank
    const finalWinnersWithCircuitPoints = finalUpdatedParticipants.map(
      (participant: any) => ({
        ...participant,
        circuitPoints: Math.max(11 - participant.rank, 0) + 10, // Rank-based points + 10 participation points
      })
    );

    console.log("finalWinnersWithCircuitPoints", reqBody);

    const updatedTournament =
      await HcaCircuitSeriesTournament.findByIdAndUpdate(
        _id,
        {
          ...reqBody,
          clockTime,
          startDate: isoStartDate,
          endDate: isoEndDate,
          participants: finalWinnersWithCircuitPoints,
        },
        { new: true }
      );

    return NextResponse.json({
      msg: "Tournament created successfully",
      statusCode: 200,
      tournament: updatedTournament,
    });
  } catch (err) {
    console.error("Error creating hca series tournament:", err);
    return NextResponse.json({
      msg: "Failed to create tournament",
      statusCode: 204,
      error: err,
    });
  }
}
