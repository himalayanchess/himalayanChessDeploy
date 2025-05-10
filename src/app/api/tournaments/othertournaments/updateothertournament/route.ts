import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import OtherTournament from "@/models/OtherTournamentsModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getFinalParticipants } from "@/helpers/tournaments/getFinalParticipants";

dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    const reqBody = await request.json();
    console.log("Updating Other Tournament:", reqBody);

    const {
      _id,
      tournamentName,
      tournamentUrl,
      tag,
      startDate,
      endDate,
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

    const existingTournament = await OtherTournament.findById(_id);

    if (!existingTournament) {
      return NextResponse.json({
        msg: "Tournament not found",
        statusCode: 404,
      });
    }

    const existingSameName = await OtherTournament.findOne({
      _id: { $ne: _id }, // Exclude the current tournament
      tournamentName: { $regex: new RegExp(`^${tournamentName}$`, "i") }, // Case-insensitive match
      activeStatus: true,
    });

    if (existingSameName) {
      return NextResponse.json({
        msg: "Tournament name already exists",
        statusCode: 204,
      });
    }

    const finalUpdatedParticipants = getFinalParticipants(
      existingTournament?.participants || [],
      participants
    );

    const isoStartDate = dayjs(startDate).utc().toDate();
    const isoEndDate = dayjs(endDate).utc().toDate();

    const clockTime = {
      initialTime,
      increment,
    };

    const updatedTournament = await OtherTournament.findByIdAndUpdate(
      _id,
      {
        tournamentName,
        tournamentUrl,
        tag,
        startDate: isoStartDate,
        endDate: isoEndDate,
        branchName,
        branchId,
        tournamentType,
        clockTime,
        totalParticipants,
        totalRounds,
        chiefArbiter,
        participants: finalUpdatedParticipants,
      },
      { new: true }
    );

    return NextResponse.json({
      msg: "Tournament updated successfully",
      statusCode: 200,
      updatedTournament,
    });
  } catch (error) {
    console.error("Error updating other tournament:", error);
    return NextResponse.json({
      msg: "Internal server error",
      statusCode: 500,
      error,
    });
  }
}
