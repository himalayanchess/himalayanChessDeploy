import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import HcaCircuitSeriesTournament from "@/models/HcaCircuitSeriesModel";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(isoWeek);
dayjs.extend(weekday);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();

    const reqBody = await request.json();
    console.log("adding hca serues tournamte", reqBody);

    const {
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
    const existing = await HcaCircuitSeriesTournament.findOne({
      tournamentName: { $regex: new RegExp(`^${tournamentName}$`, "i") },
      activeStatus: true,
    });

    if (existing) {
      return NextResponse.json({
        msg: "Tournament with this name already exists.",
        statusCode: 204,
      });
    }

    const isoStartDate = startDate ? dayjs(startDate).utc().toDate() : "";
    const isoEndDate = endDate ? dayjs(endDate).utc().toDate() : "";

    const clockTime = {
      initialTime, // initial time in minutes
      increment, // increment time in seconds
    };

    // update circuitPoints form its rank
    const updatedParticipants = participants.map((participant: any) => {
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
    });

    const newTournament = await HcaCircuitSeriesTournament.create({
      ...reqBody,
      clockTime,
      startDate: isoStartDate,
      endDate: isoEndDate,
      participants: updatedParticipants,
    });

    return NextResponse.json({
      msg: "Tournament created successfully",
      statusCode: 200,
      tournament: newTournament,
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
