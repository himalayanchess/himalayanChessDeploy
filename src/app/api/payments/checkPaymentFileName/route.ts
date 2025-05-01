import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { fileName } = reqBody;

    if (!fileName) {
      return NextResponse.json({
        msg: "Missing File name",
        statusCode: 400,
      });
    }

    // Look for an active file with the given name
    const paymentWithFile = await Payment.findOne({
      paymentFiles: {
        $elemMatch: {
          fileName: { $regex: new RegExp(`^${fileName}$`, "i") },
        },
      },
    });

    if (!paymentWithFile) {
      return NextResponse.json({
        msg: "Payment file name doesnt exists continue",
        statusCode: 200,
      });
    } else {
      return NextResponse.json({
        msg: "Payment file name already exists",
        statusCode: 204,
      });
    }
  } catch (error: any) {
    console.error("Error checking payment file name:", error);
    return NextResponse.json({
      msg: "Server error",
      statusCode: 500,
      error: error.message,
    });
  }
}
