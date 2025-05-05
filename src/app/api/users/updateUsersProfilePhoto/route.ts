import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { userId, editedProfilePhotoUrl } = reqBody;
    console.log("user update profile photo ", reqBody);

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        imageUrl: editedProfilePhotoUrl,
      },
      { new: true }
    );
    if (updatedUser) {
      return NextResponse.json({
        msg: "Profile photo updated",
        statusCode: 200,
        updatedUser,
      });
    }
    return NextResponse.json({
      msg: "Failed to update user profile photo",
      statusCode: 204,
    });
  } catch (error) {
    console.log("Internal error in updateUsersProfilePhoto route", error);
    return NextResponse.json({
      msg: "Internal error in updateUsersProfilePhoto route",
      statusCode: 204,
      error,
    });
  }
}
