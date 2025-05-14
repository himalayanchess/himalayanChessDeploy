import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const deletedPaymentRecord = await Payment.findByIdAndUpdate(
      { _id: reqBody.paymentRecordId },
      { activeStatus: false }
    );

    if (deletedPaymentRecord) {
      return NextResponse.json({
        msg: "Payment record deleted",
        statusCode: 200,
      });
    }
    return NextResponse.json({
      msg: "Payment record delete failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in deletePayment record route",
      statusCode: 204,
      error,
    });
  }
}
