import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import User from "@/models/UserModel";
import { sendBirthdayMail } from "@/helpers/nodemailer/nodemailer";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import type { NextRequest } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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

    const students = await HcaAffiliatedStudent.find();
    const users = await User.find().select("-password");

    const allPeople = [
      ...students.map((student: any) => ({
        ...student.toObject(),
        extractedRole: "Student",
      })),
      ...users.map((user: any) => ({
        ...user.toObject(),
        extractedRole: "User",
      })),
    ];

    const birthdayPeople = allPeople.filter((person) => {
      if (!person.dob) return false;
      const dob = dayjs(person.dob).tz("Asia/Kathmandu");
      const dobThisYear = dob.year(today.year());
      return (
        dobThisYear.isSameOrAfter(startOfWeek, "day") &&
        dobThisYear.isSameOrBefore(endOfWeek, "day")
      );
    });

    if (birthdayPeople.length === 0) {
      return Response.json({ msg: "No birthdays this week.", statusCode: 200 });
    }

    await sendBirthdayMail({
      subject: "🎉 Users and Students with Birthdays This Week!",
      birthdayPeople,
      weekRange: `${startOfWeek.format("MMMM D")} - ${endOfWeek.format(
        "MMMM D"
      )}`,
    });

    return Response.json({
      msg: `Sent birthday email for ${birthdayPeople.length} person(s).`,
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
