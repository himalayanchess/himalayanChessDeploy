import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import Branch from "@/models/BranchModel";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

function escapeRegex(string: any) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();
    const timeZone = "Asia/Kathmandu";

    const utcEstablishedDate = reqBody?.establishedDate
      ? dayjs(reqBody.establishedDate).tz(timeZone).startOf("day").utc()
      : "";

    // check if main branch already exists
    if (reqBody.isMainBranch) {
      const mainBranchExists = await Branch.findOne({ isMainBranch: true });
      if (mainBranchExists) {
        return NextResponse.json({
          statusCode: 204,
          msg: "Main branch already exists",
        });
      }
    }

    // Check for existing branch by name or code (case-insensitive)
    const branchExists = await Branch.findOne({
      _id: { $ne: reqBody._id },
      $or: [
        {
          branchName: {
            $regex: `^${escapeRegex(reqBody.branchName)}$`,
            $options: "i",
          },
        },
        {
          branchCode: {
            $regex: `^${escapeRegex(reqBody.branchCode)}$`,
            $options: "i",
          },
        },
      ],
    });

    if (branchExists) {
      return NextResponse.json({
        statusCode: 204,
        msg: "Branch name or code already exists",
      });
    }

    const newBranch = new Branch({
      ...reqBody,
      establishedDate: utcEstablishedDate,
    });

    const savedNewBranch = await newBranch.save();

    if (savedNewBranch) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New branch added",
        savedNewBranch,
      });
    }

    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new Branch",
    });
  } catch (error) {
    console.log("Internal error in addNewBranch route", error);

    return NextResponse.json({
      statusCode: 500,
      msg: "Internal server error",
      error,
    });
  }
}
