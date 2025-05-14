import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import Branch from "@/models/BranchModel";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

const timeZone = "Asia/Kathmandu";

function escapeRegex(str: string) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { _id, branchName, branchCode, isMainBranch } = reqBody;

    const establishedDate = reqBody?.establishedDate
      ? dayjs(reqBody?.establishedDate).tz(timeZone).startOf("day").utc()
      : null;

    // Check for existing branch name (case-insensitive) excluding current
    const existingName = await Branch.findOne({
      branchName: { $regex: `^${escapeRegex(branchName)}$`, $options: "i" },
      _id: { $ne: _id },
    });

    if (existingName) {
      return NextResponse.json({
        msg: "Branch name already exists",
        statusCode: 409,
      });
    }

    // Check for existing branch code (case-insensitive) excluding current
    const existingCode = await Branch.findOne({
      branchCode: { $regex: `^${escapeRegex(branchCode)}$`, $options: "i" },
      _id: { $ne: _id },
    });

    if (existingCode) {
      return NextResponse.json({
        msg: "Branch code already exists",
        statusCode: 409,
      });
    }

    // If marked as main branch, ensure no other main branch exists
    if (isMainBranch) {
      const existingMainBranch = await Branch.findOne({
        isMainBranch: true,
        _id: { $ne: _id },
      });

      if (existingMainBranch) {
        return NextResponse.json({
          msg: "Another main branch already exists",
          statusCode: 409,
        });
      }
    }

    // Update the branch
    const updatedBranch = await Branch.findOneAndUpdate(
      { _id },
      {
        ...reqBody,
        establishedDate,
        isMainBranch,
      },
      { new: true }
    );

    if (updatedBranch) {
      return NextResponse.json({
        msg: "Branch updated successfully",
        statusCode: 200,
        updatedBranch,
      });
    }

    return NextResponse.json({
      msg: "Branch update failed",
      statusCode: 204,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal error in updateBranch route",
      statusCode: 500,
      error,
    });
  }
}
