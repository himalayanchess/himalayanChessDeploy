import { dbconnect } from "@/index";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import bcryptjs from "bcryptjs";
export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await req.json();
    console.log(reqBody);
    // Check if user with the same name exists (case-insensitive)
    const userExists = await User.findOne({
      name: { $regex: new RegExp(`^${reqBody.name}$`, "i") },
    });
    if (userExists) {
      return NextResponse.json({ msg: "User already exists", statusCode: 204 });
    }
    // hash the password using bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(reqBody.password, salt);

    const newUser = new User({
      ...reqBody,
      password: hashedPassword,
    });
    const savedNewUser = await newUser.save();
    // new user added success
    if (savedNewUser) {
      return NextResponse.json({
        statusCode: 200,
        msg: "New user added",
        savedNewUser,
      });
    }
    // user add fail
    return NextResponse.json({
      statusCode: 204,
      msg: "Failed to add new user",
    });
  } catch (error) {
    console.log("Internal error in addNewUser route", error);

    return NextResponse.json({
      statusCode: 204,
      msg: "Internal error in addNewUser route",
      error,
    });
  }
}
