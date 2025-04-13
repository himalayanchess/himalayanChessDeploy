import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// Extend dayjs with both plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export function getOTPEmailContent(otp: any) {
  const currentDate = dayjs()
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY [at] h:mm A");

  const emailContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
              margin: 0;
              width: 100%;
            }
            .container {
              width: 100%;
              max-width: 600px;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              margin: 0 auto;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #4CAF50;
              font-size: 24px;
              margin-bottom: 5px;
            }
            .otp-box {
              background-color: #4CAF50;
              color: #ffffff;
              padding: 20px;
              text-align: center;
              font-size: 36px;
              border-radius: 8px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .footer {
              font-size: 12px;
              text-align: center;
              color: #888888;
              margin-top: 20px;
            }
            .timestamp {
              font-size: 14px;
              text-align: center;
              color: #333333;
              margin-top: 10px;
            }
            /* Media Queries for responsiveness */
            @media (max-width: 600px) {
              .otp-box {
                font-size: 28px;
                padding: 15px;
              }
              .container {
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Himalayan Chess Academy</h1>
              <p>We received a request to reset your password. Use the OTP below to continue.</p>
            </div>
            <div class="otp-box">
              <p>Your OTP: <strong>${otp}</strong></p>
            </div>
            <div class="timestamp">
              <p>Requested on: ${currentDate}</p>
            </div>
            <div class="footer">
              <p>© Himalayan Chess Academy, All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  return emailContent;
}

export function getLeaveRequestEmailContent({
  userName,
  userRole,
  leaveSubject,
  leaveReason,
  fromDate,
  toDate,
  leaveDurationDays,
  affectedClasses,
}: any) {
  const formattedFromDate = dayjs(fromDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY");
  const formattedToDate = dayjs(toDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY");

  const formattedAffectedClasses = affectedClasses.length
    ? affectedClasses
        .map((affectedClass: any) => affectedClass.affectedClassName)
        .join(", ")
    : "None";

  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f7fa;
              color: #333;
              width: 100%;
              overflow-x: hidden;
            }
            .container {
              width: 100%;
              max-width: 100%;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              margin: 20px auto;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              font-size: 28px;
              font-weight: 600;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .content {
              font-size: 16px;
              line-height: 1.8;
              padding-bottom: 20px;
              color: #555555;
            }
            .highlight {
              font-weight: bold;
              color: #4caf50;
            }
            .footer {
              font-size: 12px;
              text-align: center;
              color: #888888;
              margin-top: 30px;
            }
            .footer p {
              margin: 0;
            }
            .section-title {
              font-weight: 600;
              color: #1a73e8; /* Primary accent color */
            }
            .section-content {
              margin-bottom: 15px;
            }
            /* Background colors for different sections */
            .leave-request {
              background-color: #f0f8ff; /* Light blue background for leave request section */
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .leave-details {
              background-color: #e8f5e9; /* Light green background for details section */
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .affected-classes {
              background-color: #fff3e0; /* Light orange background for affected classes section */
              padding: 15px;
              border-radius: 8px;
            }
  
            /* Media Queries for responsiveness */
            @media (max-width: 600px) {
              .header {
                font-size: 24px;
              }
              .content {
                font-size: 14px;
              }
              .leave-request,
              .leave-details,
              .affected-classes {
                padding: 10px;
              }
              .container {
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Leave Request Notification</div>
            <div class="content">
              <div class="leave-request">
                <p><strong>Dear Superadmin,</strong></p>
                <p><span class="">${userName}</span> (Role: ${userRole}) has submitted a leave request.</p>
              </div>
  
              <div class="leave-details">
                <p><strong>Subject:</strong> ${leaveSubject}</p>
                <p><strong>Reason:</strong> ${leaveReason}</p>
                <p><strong>Duration:</strong> ${formattedFromDate} to ${formattedToDate} (${leaveDurationDays} days)</p>
              </div>
  
              <div class="affected-classes">
                <p><strong>Affected Classes:</strong> ${formattedAffectedClasses}</p>
              </div>
  
              <p>Please review and take the necessary action.</p>
              <p>Best Regards,</p>
              <p><strong>Himalayan Chess Academy</strong></p>
            </div>
  
            <div class="footer">
              <p>© Himalayan Chess Academy, All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
}

export function getLeaveRequestResponseEmailContent(
  leaveRequest: any,
  leaveStatus: any
) {
  const formattedFromDate = dayjs(leaveRequest.fromDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY [at] h:mm A");
  const formattedToDate = dayjs(leaveRequest.toDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY [at] h:mm A");

  const formattedAffectedClasses = leaveRequest.affectedClasses.length
    ? leaveRequest.affectedClasses
        .map((affectedClass: any) => affectedClass.affectedClassName)
        .join(", ")
    : "None";

  const statusColor =
    leaveStatus.toLowerCase() === "approved" ? "#28a745" : "#dc3545"; // Green for approved, Red for rejected

  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fa;
            color: #333;
            line-height: 1.6;
          }
          .container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            padding: 15px;
          }
          .content-section {
            margin-bottom: 20px;
            padding: 20px;
            background-color: ${
              leaveStatus.toLowerCase() === "approved" ? "#dfffdb" : "#ffdbe2"
            };
            border-radius: 8px;
          }
          .content-section h3 {
            font-size: 18px;
            color: #4a90e2;
            margin-bottom: 10px;
          }
          .content-section p {
            font-size: 16px;
            margin-bottom: 10px;
          }
          .highlight {
            font-weight: bold;
            color: ${statusColor}; /* Dynamic color for status */
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
          }
          .footer a {
            color: #4a90e2;
            text-decoration: none;
          }
          @media (max-width: 600px) {
            .container {
              padding: 15px;
            }
            .header h2 {
              font-size: 20px;
            }
            .content-section h3 {
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- User Greeting Section -->
          <div class="content-section">
            <p>Dear ${leaveRequest.userName},</p>
            <p>Your leave request has been <span class="" style="color:${
              leaveStatus == "approved" ? "green" : "red"
            };">${leaveStatus}</span>.</p>
          </div>

          <!-- Request Details Section -->
          <div class="" style="background:#f2f2f2;padding: 20px;border-radius: 8px;">
            <h3>Request Details:</h3>
            <p><strong>Subject:</strong> ${leaveRequest.leaveSubject}</p>
            <p><strong>Reason:</strong> ${leaveRequest.leaveReason}</p>
            <p><strong>Duration:</strong> ${formattedFromDate} - ${formattedToDate} (${
    leaveRequest.leaveDurationDays
  } days)</p>
            <p><strong>Affected Classes:</strong> ${formattedAffectedClasses}</p>
          </div>

          <!-- Footer Section -->
          <div class="footer">
            <p>© Himalayan Chess Academy, All rights reserved. | <a href="#">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getClassAssignedEmailContent({
  trainerName,
  trainerId,
  courseName,
  courseId,
  batchName,
  batchId,
  startTime,
  endTime,
  userPresentStatus,
  trainerRole,
  date,
  affiliatedTo,
  isPlayDay,
  assignedByName,
}: any) {
  const formattedStartTime = dayjs(startTime)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, h:mm A");
  const formattedEndTime = dayjs(endTime)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, h:mm A");

  const assignedDate = dayjs(date)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, h:mm A");

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f4f8;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background-color: #e3f2fd;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
            color: #1a73e8;
            text-align: center;
            margin-bottom: 20px;
          }
          .section {
            background-color: #f8f9fa;
            padding: 15px 20px;
            margin-bottom: 15px;
            border-radius: 6px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
            padding: 10px 0;
          }
          p {
            margin: 6px 0;
          }

          @media (max-width: 600px) {
            .header {
              font-size: 20px;
              padding: 15px;
            }
            .section {
              padding: 10px 15px;
            }
            .section-title {
              font-size: 15px;
            }
            .container {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Class Assigned Notification</div>

          <p><strong>Dear Superadmin,</strong></p>
          <p>A new class has been assigned to the following trainer:</p>

          <div class="section">
            <div class="section-title">Trainer Information</div>
            <p><strong>Name:</strong> ${trainerName}</p>
            <p><strong>Role:</strong> ${trainerRole}</p>
          </div>

          <div class="section">
            <div class="section-title">Class & Batch Details</div>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Batch:</strong> ${batchName}</p>
            <p><strong>Affiliated To:</strong> ${affiliatedTo}</p>
            <p><strong>Play Day:</strong> ${isPlayDay ? "Yes" : "No"}</p>
          </div>

          <div class="section">
            <div class="section-title">Schedule</div>
            <p><strong>Start:</strong> ${formattedStartTime}</p>
            <p><strong>End:</strong> ${formattedEndTime}</p>
          </div>

          <div class="section">
            <div class="section-title">Assigned By</div>
            <p><strong>Name:</strong> ${assignedByName}</p>
            <p><strong>Date:</strong> ${assignedDate}</p>
          </div>

          <p>Thank you.</p>
          <p><strong>Himalayan Chess Academy</strong></p>

          <div class="footer">
            &copy; Himalayan Chess Academy — All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getBirthdayEmailContent({ birthdayStudents, todaysDate }: any) {
  const studentListHTML = birthdayStudents
    .map(
      (s) =>
        `<p><strong>🎉 ${s.name}</strong> — ${s.phone || "No phone number"}</p>`
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f4f8;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background-color: #ffe082;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
            color: #d84315;
            text-align: center;
            margin-bottom: 20px;
          }
          .section {
            background-color: #fff8e1;
            padding: 15px 20px;
            margin-bottom: 15px;
            border-radius: 6px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
            padding: 10px 0;
          }
          p {
            margin: 6px 0;
          }

          @media (max-width: 600px) {
            .header {
              font-size: 20px;
              padding: 15px;
            }
            .section {
              padding: 10px 15px;
            }
            .container {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">🎂 Students with Birthdays Today</div>

          <p><strong>Date:</strong> ${todaysDate}</p>

          <div class="section">
            <p>The following students have birthdays today:</p>
            ${studentListHTML}
          </div>

          <p>Let's wish them a wonderful day! 🎉</p>
          <p><strong>Himalayan Chess Academy</strong></p>

          <div class="footer">
            &copy; Himalayan Chess Academy — All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}
