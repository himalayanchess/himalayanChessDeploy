import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Payment from "@/models/PaymentModel";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

function escapeRegex(string: any) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";
    const reqBody = await req.json();
    const { installments = [], totalAmount = 0 } = reqBody;

    const totalPaid = installments.reduce(
      (acc: number, curr: any) => acc + Number(curr.amount || 0),
      0
    );

    const totalAmt = Number(totalAmount);
    const remainingAmount = Math.max(totalAmt - totalPaid, 0); // avoid negative values

    let paymentStatus = "Pending";
    if (totalPaid >= totalAmt) {
      paymentStatus = "Paid";
    } else if (totalPaid > 0 && totalPaid < totalAmt) {
      paymentStatus = "Partial";
    }

    const recordAddedDate = dayjs().tz(timeZone).startOf("day").utc();

    const newPayment = new Payment({
      ...reqBody,
      recordAddedDate,
      paymentStatus,
      totalPaid,
      remainingAmount,
      createdBy: {
        ...reqBody?.createdBy,
        paymentCreatedAt: dayjs().utc().format(),
      },
    });

    const savednewPayment = await newPayment.save();
    // new payment added success
    if (savednewPayment) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New payment added",
        savednewPayment,
      });
    }
    // payment add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new payment",
    });
  } catch (error) {
    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addnewPayment route",
      error,
    });
  }
}
