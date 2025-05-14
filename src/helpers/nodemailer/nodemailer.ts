import nodemailer from "nodemailer";
import {
  getBirthdayEmailContent,
  getClassAssignedEmailContent,
  getLeaveRequestEmailContent,
  getLeaveRequestResponseEmailContent,
  getOTPEmailContent,
} from "./emailTemplates";
import User from "@/models/UserModel";

// array of test emails
const testMails: any = [process.env.SUPERADMIN_GMAIL_ADDRESS!];

// done
export async function sendOtpMail({ otp, email, subject }: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    const options = {
      from: process.env.GMAIL_EMAIL_ADDRESS, // sender address
      to: email,
      subject,
      html: getOTPEmailContent(otp),
    };
    const info = await transporter.sendMail(options);

    return info;
  } catch (error) {}
}

//done
export async function sendLeaveRequestMail({ subject, leaveRequest }: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    // to sender,BA,GA,SA
    const users = await User.find({
      activeStatus: true,
      $or: [
        { isGlobalAdmin: true },
        { role: { $regex: /^superadmin$/i } },
        {
          role: { $regex: /^admin$/i },
          branchName: {
            $regex: new RegExp(`^${leaveRequest?.branchName}$`, "i"),
          },
        },
        {
          name: { $regex: new RegExp(`^${leaveRequest?.userName}$`, "i") },
          _id: leaveRequest?.userId,
        },
      ],
    }).select("name role isGlobalAdmin email _id");
    const recepientsUserEmails = users.map((user: any) => user.email);

    const options = {
      from: process.env.GMAIL_EMAIL_ADDRESS, // sender address
      to: recepientsUserEmails,
      subject,
      html: getLeaveRequestEmailContent(leaveRequest),
    };
    const info = await transporter.sendMail(options);

    return info;
  } catch (error) {}
}

// done
export async function sendLeaveRequestResponseMail({
  subject,
  leaveRequest,
}: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // send to Sender,SA,Ga
    const users = await User.find({
      activeStatus: true,
      $or: [
        { isGlobalAdmin: true },
        { role: { $regex: /^superadmin$/i } },
        {
          name: { $regex: new RegExp(`^${leaveRequest?.userName}$`, "i") },
          _id: leaveRequest?.userId,
        },
      ],
    }).select("name role isGlobalAdmin email _id");
    const recepientsUserEmails = users.map((user: any) => user.email);

    const leaveStatus =
      leaveRequest.approvalStatus === "approved" ? "approved" : "rejected";

    const options = {
      from: process.env.GMAIL_EMAIL_ADDRESS, // sender address
      to: recepientsUserEmails,
      subject,
      html: getLeaveRequestResponseEmailContent(leaveRequest, leaveStatus),
    };
    const info = await transporter.sendMail(options);

    return info;
  } catch (error) {}
}

// done
// send assign class email (done need to set fetches emails instead of hardcode one)
export async function sendAssignClassMail({ subject, assignedClass }: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const users = await User.find({
      activeStatus: true,
      $or: [
        { isGlobalAdmin: true },
        { role: { $regex: /^superadmin$/i } },
        {
          role: { $regex: /^admin$/i },
          branchName: {
            $regex: new RegExp(`^${assignedClass?.branchName}$`, "i"),
          },
        },
        {
          name: { $regex: new RegExp(`^${assignedClass?.trainerName}$`, "i") },
          _id: assignedClass?.trainerId,
        },
      ],
    }).select("name role isGlobalAdmin email _id");

    const recepientsUserEmails = users.map((user: any) => user.email);
    // console.log("indise send assign class mail function recepientsUserEmails",
    //   recepientsUserEmails
    // );

    const options = {
      from: process.env.GMAIL_EMAIL_ADDRESS, // sender address
      to: recepientsUserEmails,
      subject,
      html: getClassAssignedEmailContent(assignedClass),
    };
    const info = await transporter.sendMail(options);

    return info;
  } catch (error) {}
}

// done
export async function sendBirthdayMail({
  subject,
  birthdayPeople,
  weekRange,
}: {
  subject: string;
  birthdayPeople: any[];
  weekRange: string;
}) {
  try {
    // 1. Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 2. Fetch admins and superadmins
    const users = await User.find({
      activeStatus: true,
      $or: [
        { isGlobalAdmin: true },
        { role: { $regex: /^superadmin$/i } },
        { role: { $regex: /^admin$/i } },
      ],
    }).select("name role isGlobalAdmin email _id branchName");

    if (!users.length) {
      console.log(
        "No admin or superadmin users found to send birthday emails."
      );
      return;
    }

    // 3. Loop through each user and send personalized email
    for (const user of users) {
      const personalizedHTML = getBirthdayEmailContent({
        birthdayPeople,
        weekRange,
        currentUser: user,
      });

      const mailOptions = {
        from: process.env.GMAIL_EMAIL_ADDRESS,
        to: user.email,
        subject,
        html: personalizedHTML,
        headers: {
          "Content-Type": "text/html; charset=UTF-8", // Make sure the email is sent as HTML
        },
      };

      try {
        const info = await transporter.sendMail(mailOptions);
      } catch (sendError) {
        console.error(`❌ Failed to send email to ${user.email}:`, sendError);
      }
    }
  } catch (error) {
    console.error("❌ Error in sendBirthdayMail function:", error);
  }
}
