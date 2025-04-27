import { dbconnect } from "@/helpers/dbconnect/dbconnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { signIn } from "next-auth/react";
import LoginRecord from "@/models/LoginRecordModel"; // Import your login record model (replace with your model)
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log("login req body", reqBody);

    const fetchedUser = await User.findOne({ email });

    // user not found
    if (!fetchedUser) {
      return NextResponse.json({
        msg: "User not found",
        statusCode: 204,
      });
    }

    // inactive user
    if (!fetchedUser.activeStatus) {
      return NextResponse.json({
        msg: "User is inactive",
        statusCode: 204,
      });
    }

    // password check
    const passMatch = await bcryptjs.compare(
      String(password),
      fetchedUser.password
    );

    if (!passMatch) {
      return NextResponse.json({
        msg: "Incorrect password",
        statusCode: 204,
      });
    }

    // Get private IP address from headers (X-Forwarded-For or Remote Address)
    const privateIpAddress =
      request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent"); // Get the user-agent

    // Get public IP using ipify API
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const publicIpAddress = ipData.ip || "unknown";

    // Optional: Get geolocation data or other login-related info as needed
    // let latitude = null;
    // let longitude = null;
    // try {
    //   const geoResponse = await axios.get(
    //     `https://ipapi.co/${publicIpAddress}/json/`
    //   );
    //   latitude = geoResponse.data.latitude || null;
    //   longitude = geoResponse.data.longitude || null;
    // } catch (geoError) {
    //   console.log("Error fetching geolocation", geoError);
    // }

    // Record the login
    const newLoginRecord = new LoginRecord({
      userId: fetchedUser._id,
      email: fetchedUser.email,
      publicIpAddress,
      privateIpAddress, // Storing private IP
      userAgent, // Storing user-agent

      timestamp: new Date(),
    });

    await newLoginRecord.save(); // Save the login record to your database

    // Finally, send the success response
    return NextResponse.json({
      msg: "Login success",
      statusCode: 200,
      fetchedUser,
    });
  } catch (error) {
    console.log("Internal error in login route", error);
    return NextResponse.json({
      msg: "Internal error in login route",
      statusCode: 204,
    });
  }
}
