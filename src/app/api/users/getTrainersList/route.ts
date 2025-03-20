import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";

export async function GET(req: NextRequest) {
  try {
    await dbconnect();
    const trainersList = await User.find({ role: "Trainer" }).select(
      "-password"
    );
    // new user added success
    if (trainersList) {
      return NextResponse.json({
        statusCode: 200,
        trainersList,
        msg: "Trainers list found",
      });
    }
    // user add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to get trainers list",
    });
  } catch (error) {
    console.log("Internal error in getTrainersList route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in getTrainersList route",
      error,
    });
  }
}
