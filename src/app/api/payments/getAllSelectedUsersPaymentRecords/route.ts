import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { userId } = reqBody;

    const allSelectedUsersPaymentRecords = await Payment.find({
      "recipient.userId": userId,
    });

    console.log(
      "server getAllSelectedUsersPaymentRecords",
      userId,
      allSelectedUsersPaymentRecords
    );

    if (allSelectedUsersPaymentRecords.length > 0) {
      return NextResponse.json({
        msg: "Matching users' payment records found",
        statusCode: 200,
        allSelectedUsersPaymentRecords,
      });
    }

    return NextResponse.json({
      msg: "No matching users' payment records found",
      statusCode: 204,
    });
  } catch (error: any) {
    console.log(
      "Internal error in getAllSelectedUsersPaymentRecords route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getAllSelectedUsersPaymentRecords",
      statusCode: 500,
      error: error.message,
    });
  }
}
