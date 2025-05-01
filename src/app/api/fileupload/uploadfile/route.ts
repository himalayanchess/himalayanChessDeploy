import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

// Map config for each upload type
const cloudinaryConfigs = {
  // cyrz.mhr09
  studyMaterials: {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  },
  // inttemp09
  profileImage: {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_2,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY_2,
    api_secret: process.env.CLOUDINARY_SECRET_KEY_2,
  },
  // inttemp09
  otherFiles: {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_3,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY_3,
    api_secret: process.env.CLOUDINARY_SECRET_KEY_3,
  },
  // inttemp09
  paymentFiles: {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_3,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY_3,
    api_secret: process.env.CLOUDINARY_SECRET_KEY_3,
  },
};

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
    let cloudinaryFileType = formData.get("cloudinaryFileType") as string;

    // can have these values
    // ["profileImage","studyMaterials","otherFiles","paymentFiles"]
    if (!cloudinaryFileType) {
      cloudinaryFileType = "otherFiles";
    }

    console.log("fileee", file);

    if (!file) {
      return NextResponse.json({
        msg: "File not found",
        statusCode: 204,
      });
    }

    const selectedConfig =
      cloudinaryConfigs[cloudinaryFileType as keyof typeof cloudinaryConfigs];

    // Check if config exists before applying
    if (!selectedConfig) {
      return NextResponse.json({
        msg: "Invalid Cloudinary type provided",
        statusCode: 400,
      });
    }

    // Dynamically set cloudinary config
    cloudinary.config(selectedConfig);

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
