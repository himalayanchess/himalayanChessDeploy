import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import HcaAffiliatedStudent from "@/models/HcaAffiliatedStudent";
import nodemailer from "nodemailer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { NextRequest } from "next/server";
import { sendBirthdayMail } from "@/helpers/nodemailer/nodemailer";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await dbconnect();

    const today = dayjs().tz("Asia/Kathmandu").format("MM-DD"); // format as MM-DD for comparison
    const students = await HcaAffiliatedStudent.find();

    const birthdayStudents = students.filter((student) => {
      if (!student.dob) return false;
      const dobFormatted = dayjs(student.dob).format("MM-DD");
      return dobFormatted === today;
    });

    if (birthdayStudents.length === 0) {
      return Response.json({ msg: "No birthdays today.", statusCode: 200 });
    }

    await sendBirthdayMail({
      subject: "🎂 Students with Birthday Today!",
      birthdayStudents,
      todaysDate: today,
    });

    return Response.json({
      msg: `Sent birthday email for ${birthdayStudents.length} student(s).`,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Birthday check failed:", error);
    return Response.json({
      msg: "Internal error in birthday check",
      statusCode: 500,
      error,
    });
  }
}
