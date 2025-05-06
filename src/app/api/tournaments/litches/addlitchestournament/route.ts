import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LitchesWeeklyTournament from "@/models/LitchesWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(weekday);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();

    const body = await request.json();
    const {
      tournamentName,
      date, // from input[type=date], like "2025-04-14"
      tournamentUrl,
      tag,
      time,
      initialTime,
      increment,
      tournamentType,
      litchesWeeklyWinners = [],
    } = body;

    // Case-insensitive check for duplicate tournament
    const existing = await LitchesWeeklyTournament.findOne({
      tournamentName: { $regex: new RegExp(`^${tournamentName}$`, "i") },
    });

    if (existing) {
      return NextResponse.json({
        msg: "Tournament with this name already exists.",
        statusCode: 204,
      });
    }

    // Convert to UTC date
    const parsedDate = dayjs(date).utc();
    const isoDate = parsedDate.toDate();

    const weekNo = parsedDate.isoWeek(); // ISO week of the year
    const day = parsedDate.format("dddd"); // Full day name (e.g., Monday)
    const year = parsedDate.year();

    const clockTime = {
      initialTime, // initial time in minutes
      increment, // increment time in seconds
    };

    // update medalPoints form its rank
    const updatedWinners = litchesWeeklyWinners.map((winner: any) => ({
      ...winner,
      medalPoints: Math.max(11 - winner.rank, 0), // 1st (rank=1) → 10, 2nd → 9, ..., 10th → 1, others → 0
    }));

    const newTournament = await LitchesWeeklyTournament.create({
      tournamentName,
      date: isoDate,
      tag: "litches",
      day,
      tournamentUrl,
      time,
      clockTime,
      tournamentType,
      weekNo,
      year,
      litchesWeeklyWinners: updatedWinners,
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
