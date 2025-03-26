import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    //update trainers cv
    const updatedTrainersCV = await User.findOneAndUpdate(
      { _id: reqBody._id },
      {
        trainerCvUrl: reqBody?.trainerCvUrl,
      }
    );
    if (updatedTrainersCV) {
      return NextResponse.json({
        msg: "User cv updated",
        statusCode: 200,
        updatedTrainersCV,
      });
    }
    return NextResponse.json({
      msg: "User cv update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateTrainersCv route", error);
    return NextResponse.json({
      msg: "Internal error in updateTrainersCv route",
      statusCode: 204,
      error,
    });
  }
}
