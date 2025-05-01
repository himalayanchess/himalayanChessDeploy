import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { studentId } = reqBody;
    const allSelectedStudentsPaymentRecords = await Payment.find({
      studentId,
      activeStatus: true,
    });
    if (allSelectedStudentsPaymentRecords) {
      return NextResponse.json({
        msg: "All Selected students payment record found",
        statusCode: 200,
        allSelectedStudentsPaymentRecords,
      });
    }
    return NextResponse.json({
      msg: "All Selected students payment record failed to fetch",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getallSelectedStudentsPaymentRecords route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getallSelectedStudentsPaymentRecords",
      statusCode: 204,
      error,
    });
  }
}
