import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    let paymentRecord = await Payment.findById(reqBody?.paymentRecordId);

    if (paymentRecord) {
      return NextResponse.json({
        msg: "Payment record found",
        statusCode: 200,
        paymentRecord,
      });
    }

    return NextResponse.json({
      msg: "Payment record not found",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in getPayment record",
      statusCode: 204,
      error,
    });
  }
}
