import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Batch from "@/models/BatchModel";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    // Check if another batch already has the same name
    const existingBatch = await Batch.findOne({
      batchName: reqBody.batchName, // Assuming `name` is the unique field
      _id: { $ne: reqBody._id }, // Exclude the current batch
    });

    if (existingBatch) {
      return NextResponse.json({
        msg: "Batch name already exists",
        statusCode: 409, // Conflict status
      });
    }
    //update batch
    const updatedBatch = await Batch.findOneAndUpdate(
      { _id: reqBody._id },
      reqBody
    );
    if (updatedBatch) {
      return NextResponse.json({
        msg: "Batch updated",
        statusCode: 200,
        updatedBatch,
      });
    }
    return NextResponse.json({
      msg: "Batch update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateBatch route", error);
    return NextResponse.json({
      msg: "Internal error in updateBatch route",
      statusCode: 204,
      error,
    });
  }
}
