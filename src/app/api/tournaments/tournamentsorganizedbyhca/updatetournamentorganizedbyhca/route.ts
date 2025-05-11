import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import OtherTournament from "@/models/OtherTournamentsModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getFinalParticipants } from "@/helpers/tournaments/getFinalParticipants";
import TournamentsOrganizedByHca from "@/models/TournamentsOrganizedByHcaModel";

dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    const reqBody = await request.json();
    // console.log("Updating Other Tournament:", reqBody);

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
      isRated,
      fideUrl,
      chessResultsUrl,
      participants = [],
    } = reqBody;

    const existingTournament = await TournamentsOrganizedByHca.findById(_id);

    if (!existingTournament) {
      return NextResponse.json({
        msg: "Tournament not found",
        statusCode: 404,
      });
    }

    const existingSameName = await TournamentsOrganizedByHca.findOne({
      _id: { $ne: _id }, // Exclude the current tournament
      tournamentName: { $regex: new RegExp(`^${tournamentName}$`, "i") }, // Case-insensitive match
      branchName,
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

    const updatedTournament = await TournamentsOrganizedByHca.findByIdAndUpdate(
      _id,
      {
        ...reqBody,
        startDate: isoStartDate,
        endDate: isoEndDate,
        clockTime,
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
