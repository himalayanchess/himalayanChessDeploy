import nodemailer from "nodemailer";
import {
  getBirthdayEmailContent,
  getClassAssignedEmailContent,
  getLeaveRequestEmailContent,
  getLeaveRequestResponseEmailContent,
  getOTPEmailContent,
} from "./emailTemplates";
import User from "@/models/UserModel";

// array of superadmin and admin emails
const superadminAndAdminRecepients: any = [
  process.env.SUPERADMIN_GMAIL_ADDRESS!,
  "inttemp09@gmail.com",
];

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
    console.log("OTP email sent successfully");
    return info;
  } catch (error) {
    console.log("Error sending otp email", error);
  }
}

export async function sendLeaveRequestMail({ subject, leaveRequest }: any) {
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
      to: process.env.SUPERADMIN_GMAIL_ADDRESS,
      subject,
      html: getLeaveRequestEmailContent(leaveRequest),
    };
    const info = await transporter.sendMail(options);
    console.log("Leave request email sent successfully");
    return info;
  } catch (error) {
    console.log("Error sending leave request email", error);
  }
}

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

    const user = await User.findById(leaveRequest?.userId);
    if (!user) {
      console.log("User not found");
      return;
    }

    const userEmail = user.email;
    const leaveStatus =
      leaveRequest.approvalStatus === "approved" ? "approved" : "rejected";

    const options = {
      from: process.env.GMAIL_EMAIL_ADDRESS, // sender address
      to: userEmail,
      subject,
      html: getLeaveRequestResponseEmailContent(leaveRequest, leaveStatus),
    };
    const info = await transporter.sendMail(options);
    console.log("Leave request response email sent successfully");
    return info;
  } catch (error) {
    console.log("Error sending leave request response email", error);
  }
}

// send assign class email
export async function sendAssignClassMail({ subject, assignedClass }: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    console.log(
      "indise send assign class mail function",
      superadminAndAdminRecepients
    );

    const options = {
      from: process.env.GMAIL_EMAIL_ADDRESS, // sender address
      to: superadminAndAdminRecepients,
      subject,
      html: getClassAssignedEmailContent(assignedClass),
    };
    const info = await transporter.sendMail(options);
    console.log("Assign class email sent successfully");
    return info;
  } catch (error) {
    console.log("Error sending assign class email", error);
  }
}

export async function sendBirthdayMail({
  subject,
  birthdayStudents,
  todaysDate,
}: any) {
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
      to: superadminAndAdminRecepients,
      subject,
      html: getBirthdayEmailContent({ birthdayStudents, todaysDate }),
    };
    const info = await transporter.sendMail(options);
    console.log("Birthday email email sent successfully");
    return info;
  } catch (error) {
    console.log("Error sending assign class email", error);
  }
}
