import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import User from "@/models/UserModel";
import { sendBirthdayMail } from "@/helpers/nodemailer/nodemailer";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { NextRequest } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(request: NextRequest) {
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    await dbconnect();

    const today = dayjs().tz("Asia/Kathmandu");
    const startOfWeek = today.startOf("week");
    const endOfWeek = today.endOf("week");

    // Generate a list of { day, month } for the current week
    const weekDates: any = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, "day");
      weekDates.push({ day: date.date(), month: date.month() }); // month is 0-indexed
    }

    // Only get HCA-affiliated students
    const students = await HcaAffiliatedStudent.find();

    const birthdayPeople = students.filter((student: any) => {
      if (!student.dob) return false;

      const dob = dayjs(student.dob).tz("Asia/Kathmandu");
      const dobDay = dob.date();
      const dobMonth = dob.month();

      return weekDates.some(
        (d: any) => d.day === dobDay && d.month === dobMonth
      );
    });

    if (birthdayPeople.length === 0) {
      return Response.json({ msg: "No birthdays this week.", statusCode: 200 });
    }

    await sendBirthdayMail({
      subject: "🎉 HCA Students with Birthdays This Week!",
      birthdayPeople,
      weekRange: `${startOfWeek.format("MMMM D")} - ${endOfWeek.format(
        "MMMM D"
      )}`,
    });

    return Response.json({
      msg: `Sent birthday email for ${birthdayPeople.length} student(s).`,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Weekly birthday check failed:", error);
    return Response.json({
      msg: "Internal error in birthday check",
      statusCode: 500,
      error,
    });
  }
}
