import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import LoginRecord from "@/models/LoginRecordModel"; // Assuming the LoginRecord model is located here

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbconnect();

    // Parse the request body
    const reqBody = await req.json();
    console.log("inside add new login record", reqBody);

    // Create a new login record using the request body
    const newLoginRecord = new LoginRecord({
      userId: reqBody.userId,
      name: reqBody.name,
      email: reqBody.email,
      role: reqBody.role,
      branchName: reqBody.branchName,
      branchId: reqBody.branchId,
      isGlobalAdmin: reqBody.isGlobalAdmin,
      ipAddress: reqBody.ipAddress,
      userAgent: reqBody.userAgent,
      timeZone: reqBody.timeZone || "UTC", // Default to UTC if no timezone provided
      latitude: reqBody.latitude || null,
      longitude: reqBody.longitude || null,
    });

    // Save the new login record to the database
    const savedLoginRecord = await newLoginRecord.save();

    // If successful, return a success response
    if (savedLoginRecord) {
      return NextResponse.json({
        statusCode: 200,
        msg: "Login record added",
        savedLoginRecord,
      });
    }

    // If saving fails, return a failure response
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add login record",
    });
  } catch (error) {
    console.log("Error while saving login record in db", error);

    return NextResponse.json({
      statusCode: 500,
      msg: "Internal error while saving login record",
      error,
    });
  }
}
