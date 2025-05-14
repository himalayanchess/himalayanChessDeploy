import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import LichessWeeklyTournament from "@/models/LichessWeeklyTournamentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import HcaCircuitTournament from "@/models/HcaCircuitTournamentModel";

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
      tournamentName,
      tag,

      startDate = "", // from input[type=date], like "2025-04-14"
      endDate = "", // from input[type=date], like "2025-04-14"
      branchName,
      branchId,
    } = reqBody;

    // Case-insensitive check for duplicate tournament
    const existing = await HcaCircuitTournament.findOne({
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

    const isoStartDate = startDate ? dayjs(startDate).utc().toDate() : "";
    const isoEndDate = endDate ? dayjs(endDate).utc().toDate() : "";

    const newTournament = await HcaCircuitTournament.create({
      ...reqBody,
      startDate: isoStartDate,
      endDate: isoEndDate,
    });

    return NextResponse.json({
      msg: "Tournament created successfully",
      statusCode: 200,
      tournament: newTournament,
    });
  } catch (err) {
    console.error("Error creating hca circuit tournament:", err);
    return NextResponse.json({
      msg: "Failed to create hca circuit tournament",
      statusCode: 204,
      error: err,
    });
  }
}
