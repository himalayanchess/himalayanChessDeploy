import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();

    const {
      paymentRecordId,
      fileName,
      fileUrl,
      fileType,
      uploadedById,
      uploadedByName,
    } = reqBody;

    if (!paymentRecordId || !fileUrl || !fileName) {
      return NextResponse.json({
        msg: "Missing required fields",
        statusCode: 400,
      });
    }

    const payment = await Payment.findById(paymentRecordId);
    if (!payment) {
      return NextResponse.json({
        msg: "Payment record not found",
        statusCode: 404,
      });
    }

    const newFileEntry = {
      fileName,
      fileUrl,
      fileType,
      uploadedAt: dayjs().utc().toDate(),
      uploadedById,
      uploadedByName,
      activeStatus: true,
    };

    payment.paymentFiles.push(newFileEntry);
    await payment.save();

    return NextResponse.json({
      msg: "Payment file added successfully",
      statusCode: 200,
      updatedPayment: payment,
    });
  } catch (error: any) {
    console.error("Error adding payment file:", error);
    return NextResponse.json({
      msg: "Server error",
      statusCode: 500,
      error: error.message,
    });
  }
}
