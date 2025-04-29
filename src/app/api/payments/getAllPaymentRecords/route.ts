import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbconnect();
    const allPaymentRecords = await Payment.find({});
    if (allPaymentRecords) {
      return NextResponse.json({
        msg: "All Payment record found",
        statusCode: 200,
        allPaymentRecords,
      });
    }
    return NextResponse.json({
      msg: "All Payment record fetching failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in getallPaymentRecords route", error);
    return NextResponse.json({
      msg: "Internal error in getallPaymentRecords",
      statusCode: 204,
      error,
    });
  }
}
