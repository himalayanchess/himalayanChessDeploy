import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import OtherTournament from "@/models/OtherTournamentsModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import HcaCircuitTournament from "@/models/HcaCircuitTournamentModel";

dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    const reqBody = await request.json();

    const {
      _id,
      tournamentName,
      tag,
      startDate = "",
      endDate = "",
      branchName,
      branchId,
    } = reqBody;

    const existingTournament = await HcaCircuitTournament.findById(_id);

    if (!existingTournament) {
      return NextResponse.json({
        msg: "Tournament not found",
        statusCode: 404,
      });
    }

    const existingSameName = await OtherTournament.findOne({
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

    const isoStartDate = startDate ? dayjs(startDate).utc().toDate() : "";
    const isoEndDate = endDate ? dayjs(endDate).utc().toDate() : "";

    const updatedTournament = await HcaCircuitTournament.findByIdAndUpdate(
      _id,
      {
        ...reqBody,
        startDate: isoStartDate,
        endDate: isoEndDate,
      },
      { new: true }
    );

    return NextResponse.json({
      msg: "Tournament updated successfully",
      statusCode: 200,
      updatedTournament,
    });
  } catch (error) {
    console.error("Error updating hca circuit tournament:", error);
    return NextResponse.json({
      msg: "Internal server error",
      statusCode: 500,
      error,
    });
  }
}
