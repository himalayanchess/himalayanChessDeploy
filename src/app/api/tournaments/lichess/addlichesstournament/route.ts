import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(isoWeek);
dayjs.extend(weekday);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();

    const body = await request.json();
    console.log("adding lichess tournamte", body);

    const {
      tournamentName,
      date, // from input[type=date], like "2025-04-14"
      tournamentUrl,
      tag,
      time,
      initialTime,
      branchName,
      branchId,
      increment,
      tournamentType,
      totalParticipants,
      lichessWeeklyWinners = [],
    } = body;

    // Case-insensitive check for duplicate tournament
    const existing = await LichessWeeklyTournament.findOne({
      tournamentName: { $regex: new RegExp(`^${tournamentName}$`, "i") },
      activeStatus: true,
    });

    if (existing) {
      return NextResponse.json({
        msg: "Tournament with this name already exists.",
        statusCode: 204,
      });
    }

    const parsedDateUtc = dayjs(date).utc(); // UTC for ISO
    const isoDate = parsedDateUtc.toDate(); // Keep this in UTC

    const parsedDateNepal = dayjs(date).tz(timeZone); // For Nepali time zone
    const weekNo = parsedDateNepal.isoWeek(); // Week in Nepali time
    const day = parsedDateNepal.format("dddd"); // Day in Nepali time
    const year = parsedDateNepal.year(); // Year in Nepali time

    const clockTime = {
      initialTime, // initial time in minutes
      increment, // increment time in seconds
    };

    // update medalPoints form its rank
    const updatedWinners = lichessWeeklyWinners.map((winner: any) => ({
      ...winner,
      medalPoints: Math.max(11 - winner.rank, 0), // 1st (rank=1) → 10, 2nd → 9, ..., 10th → 1, others → 0
    }));

    const newTournament = await LichessWeeklyTournament.create({
      tournamentName,
      date: isoDate,
      tag: "lichess",
      day,
      tournamentUrl,
      branchName,
      branchId,
      time,
      clockTime,
      tournamentType,
      totalParticipants,
      weekNo,
      year,
      lichessWeeklyWinners: updatedWinners,
    });

    return NextResponse.json({
      msg: "Tournament created successfully",
      statusCode: 200,
      tournament: newTournament,
    });
  } catch (err) {
    console.error("Error creating tournament:", err);
    return NextResponse.json({
      msg: "Failed to create tournament",
      statusCode: 204,
      error: err,
    });
  }
}
