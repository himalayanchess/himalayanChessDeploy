import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    const { paymentFileName } = reqBody;

    if (!paymentFileName) {
      return NextResponse.json({
        msg: "Missing payment file name",
        statusCode: 400,
      });
    }

    // Find the payment document that contains the file
    const payment = await Payment.findOne({
      "paymentFiles.fileName": paymentFileName,
    });

    if (!payment) {
      return NextResponse.json({
        msg: "Payment record not found",
        statusCode: 404,
      });
    }

    // Find the specific file and set activeStatus to false
    const fileToUpdate = payment.paymentFiles.find(
      (file: any) => file.fileName === paymentFileName
    );

    if (!fileToUpdate) {
      return NextResponse.json({
        msg: "Payment file not found",
        statusCode: 404,
      });
    }

    // soft delete
    fileToUpdate.activeStatus = false;

    await payment.save();

    return NextResponse.json({
      msg: "Payment file delted",
      statusCode: 200,
      updatedPayment: payment,
    });
  } catch (error: any) {
    console.error("Error  deleting payment file:", error);
    return NextResponse.json({
      msg: "Server error",
      statusCode: 500,
      error: error.message,
    });
  }
}
