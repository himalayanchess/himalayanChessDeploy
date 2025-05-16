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
const timeZone = "Asia/Kathmandu";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

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

    // Fetch students and users
    const [students, users] = await Promise.all([
      HcaAffiliatedStudent.find().select(
        "_id name dob role branchName branchId imageUrl"
      ),
      User.find({ isActive: true }).select(
        "_id name dob role branchName branchId imageUrl"
      ),
    ]);

    // Combine all people, with extractedRole set accordingly
    const allPeople = [
      ...students.map((s: any) => ({
        ...s.toObject(),
        extractedRole: "Student",
      })),
      ...users.map((u: any) => ({ ...u.toObject(), extractedRole: "User" })),
    ];

    // Filter those with birthdays this week (by day/month only)
    const birthdayThisWeek = allPeople.filter((person) => {
      if (!person.dob) return false;
      const dob = dayjs(person.dob).tz(timeZone);
      return weekDates.some(
        (d: any) => d.day === dob.date() && d.month === dob.month()
      );
    });

    if (birthdayThisWeek?.length === 0) {
      return new Response(
        JSON.stringify({ msg: "No birthdays this week.", statusCode: 200 }),
        { status: 200 }
      );
    }

    // Optionally send birthday email
    await sendBirthdayMail({
      subject: "🎉 Birthdays This Week!",
      birthdayPeople: birthdayThisWeek,
      weekRange: `${startOfWeek.format("MMMM D")} - ${endOfWeek.format(
        "MMMM D"
      )}`,
    });

    return new Response(
      JSON.stringify({
        msg: `Sent birthday email for ${birthdayThisWeek.length} person(s).`,
        statusCode: 200,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Weekly birthday check failed:", error);
    return Response.json({
      msg: "Internal error in birthday check",
      statusCode: 500,
      error,
    });
  }
}
