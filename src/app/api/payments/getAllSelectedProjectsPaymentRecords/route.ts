import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { projectId } = reqBody;
    const allSelectedProjectsPaymentRecords = await Payment.find({
      projectId,
    });
    if (allSelectedProjectsPaymentRecords) {
      return NextResponse.json({
        msg: "All Selected Projects payment record found",
        statusCode: 200,
        allSelectedProjectsPaymentRecords,
      });
    }
    return NextResponse.json({
      msg: "All Selected Projects payment record failed to fetch",
      statusCode: 204,
    });
  } catch (error) {
    console.log(
      "Internal error in getallSelectedProjectsPaymentRecords route",
      error
    );
    return NextResponse.json({
      msg: "Internal error in getallSelectedProjectsPaymentRecords",
      statusCode: 204,
      error,
    });
  }
}
