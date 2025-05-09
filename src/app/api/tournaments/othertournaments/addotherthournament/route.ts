import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import OtherTournament from "@/models/OtherTournamentsModel";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(isoWeek);
dayjs.extend(weekday);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();

    const reqBody = await request.json();
    console.log("adding lichess tournamte", reqBody);

    const {
      tournamentName,
      tournamentUrl,
      tag,

      startDate, // from input[type=date], like "2025-04-14"
      endDate, // from input[type=date], like "2025-04-14"
      branchName,
      branchId,
      tournamentType,

      initialTime,
      increment,

      totalParticipants,
      totalRounds,

      chiefArbiter,

      participants = [],
    } = reqBody;

    // Case-insensitive check for duplicate tournament
    const existing = await OtherTournament.findOne({
      tournamentName: { $regex: new RegExp(`^${tournamentName}$`, "i") },
      branchName,
      activeStatus: true,
    });

    if (existing) {
      return NextResponse.json({
        msg: "Tournament with this name already exists.",
        statusCode: 204,
      });
    }

    const isoStartDate = dayjs(startDate).utc().toDate(); // UTC for ISO
    const isoEndDate = dayjs(endDate).utc().toDate(); // UTC for ISO

    const clockTime = {
      initialTime, // initial time in minutes
      increment, // increment time in seconds
    };

    const newTournament = await OtherTournament.create({
      ...reqBody,
      clockTime,
      startDate: isoStartDate,
      endDate: isoEndDate,
    });

    return NextResponse.json({
      msg: "New Other Tournament created successfully",
      statusCode: 200,
      tournament: newTournament,
    });
  } catch (err) {
    console.error("Error creating new other tournament:", err);
    return NextResponse.json({
      msg: "Failed to create new other tournament",
      statusCode: 204,
      error: err,
    });
  }
}
