import { dbconnect } from "@/index";
import StudyMaterial from "@/models/StudyMaterialsModel";
import { NextRequest, NextResponse } from "next/server";

function escapeRegex(string: any) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();

    console.log("Received Study Material Data:", reqBody);

    // Check if file with same name already exists (optional)
    const fileExists = await StudyMaterial.findOne({
      fileName: {
        $regex: `^${escapeRegex(reqBody.fileName)}$`,
        $options: "i",
      },
    });

    if (fileExists) {
      return NextResponse.json({
        statusCode: 204,
        msg: "Study material with same name already exists",
      });
    }

    const savedNewStudyMaterial = new StudyMaterial({
      ...reqBody,
    });

    const newStudyMaterial = await savedNewStudyMaterial.save();

    if (newStudyMaterial) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New study material added",
        newStudyMaterial,
      });
    }

    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new study material",
    });
  } catch (error) {
    console.error("Error in addStudyMaterial route:", error);
    return NextResponse.json({
      statusCode: 500,
      msg: "Internal server error",
      error,
    });
  }
}
