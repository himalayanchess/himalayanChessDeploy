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

    // Update circuitPoints based on participant type and rank
    const finalWinnersWithCircuitPoints = finalUpdatedParticipants.map(
      (participant: any) => {
        let circuitPoints = 10; // Base participation points for everyone

        // Add points based on participant type
        if (
          participant.participantType?.toLowerCase() === "top 10 rank" &&
          participant.rank <= 10
        ) {
          circuitPoints += 11 - participant.rank; // 1st=10, 10th=1
        } else if (
          participant.participantType?.toLowerCase() === "category winner"
        ) {
          circuitPoints += 0.5; // Additional 0.5 points for category winners
        }
        // Regular participants just get the base 10 points

        return {
          ...participant,
          circuitPoints,
        };
      }
    );

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
