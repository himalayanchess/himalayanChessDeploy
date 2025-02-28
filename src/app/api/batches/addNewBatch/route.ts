import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import Batch from "@/models/BatchModel";

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();
    console.log(reqBody);
    const batchExists = await Batch.findOne({ batchName: reqBody.batchName });
    if (batchExists) {
      return NextResponse.json({
        statusCode: 204,
        msg: "Batch already exists",
      });
    }
    const newBatch = new Batch(reqBody);
    const savedNewBatch = await newBatch.save();
    // new batch added success
    if (savedNewBatch) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New batch added",
        savedNewBatch,
      });
    }
    // batch add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new batch",
    });
  } catch (error) {
    console.log("Internal error in addNewBatch route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewBatch route",
      error,
    });
  }
}
