import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

interface cloudinaryResut {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = file?.type.startsWith("image/") ? "image" : "raw";
    const folderName = formData.get("folderName") as string;

    console.log("fileee", file);

    if (!file) {
      return NextResponse.json({
        msg: "File not found",
        statusCode: 204,
      });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const res = await new Promise<cloudinaryResut>((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: fileType, // This ensures PDF files are handled correctly
          folder: folderName,
        },
        (error, result) => {
          if (error) rej(error);
          else res(result as cloudinaryResut);
        }
      );
      uploadStream.end(buffer);
    });
    console.log("file upload response ", res);

    return NextResponse.json({
      msg: "File uploaded",
      res,
      statusCode: 200,
    });
  } catch (error) {
    console.log("cloudinary error in route", error);
    return NextResponse.json({
      msg: "Cloudinary error route",
      statusCode: 204,
      error,
    });
  }
}
