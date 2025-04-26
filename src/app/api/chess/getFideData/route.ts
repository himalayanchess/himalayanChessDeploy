import { getFideData } from "@/helpers/chess/getFideData";
import { NextRequest, NextResponse } from "next/server";

// not working, invalid fide id even if valid
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { fideId } = reqBody;

    if (!fideId) {
      return NextResponse.json({
        msg: "FIDE ID is required",
        statusCode: 204,
      });
    }

    const fideData = await getFideData(fideId);

    if (!fideData || !fideData.name) {
      return NextResponse.json({
        msg: "Invalid or non-existent FIDE ID",
        statusCode: 204,
      });
    }

    return NextResponse.json({
      msg: "FIDE data found",
      statusCode: 200,
      fideData,
    });
  } catch (error: any) {
    console.error("Internal error in getFide route:", error);
    return NextResponse.json({
      msg: "Internal error while fetching FIDE data",
      statusCode: 204,
      error: error.message,
    });
  }
}
