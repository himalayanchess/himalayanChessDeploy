import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const timeZone = "Asia/Kathmandu";

    const reqBody = await request.json();

    const utcJoinedDate = reqBody?.joinedDate
      ? dayjs(reqBody?.joinedDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcEndDate = reqBody?.endDate
      ? dayjs(reqBody?.endDate).tz(timeZone).startOf("day").utc()
      : "";
    const utcDob = reqBody?.dob
      ? dayjs(reqBody?.dob).tz(timeZone).startOf("day").utc()
      : "";
    // Check if another user already has the same name
    const existingUser = await User.findOne({
      _id: { $ne: reqBody._id }, // Exclude the current user
      $or: [
        { name: { $regex: `^${reqBody.name}$`, $options: "i" } },
        { email: { $regex: `^${reqBody.email}$`, $options: "i" } },
      ],
    });

    if (existingUser) {
      return NextResponse.json({
        msg: "Username or email already exists",
        statusCode: 409, // Conflict status
      });
    }
    // console.log("updateuser route", reqBody);
    const { password, ...updateFields } = reqBody;

    const updatedUser = await User.findOneAndUpdate(
      { _id: reqBody._id },
      {
        ...updateFields,
        dob: utcDob,
        joinedDate: utcJoinedDate,
        endDate: utcEndDate,
        isActive: reqBody?.isActive?.toLowerCase() == "active",
      }
    );
    if (updatedUser) {
      return NextResponse.json({
        msg: "User updated",
        statusCode: 200,
        updatedUser,
      });
    }
    return NextResponse.json({
      msg: "User update failed",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateUser route", error);
    return NextResponse.json({
      msg: "Internal error in updateUser route",
      statusCode: 204,
      error,
    });
  }
}
