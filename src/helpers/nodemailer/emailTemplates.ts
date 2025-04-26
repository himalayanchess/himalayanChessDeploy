import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// Extend dayjs with both plugins
dayjs.extend(utc);
dayjs.extend(timezone);
let timeZone = "Asia/Kathmandu";
//done
export function getOTPEmailContent(otp: any) {
  const currentDate = dayjs().tz(timeZone).format("MMMM D, YYYY [at] h:mm A");

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

// done
export function getLeaveRequestEmailContent({
  userName,
  userRole,
  leaveSubject,
  leaveReason,
  fromDate,
  toDate,
  leaveDurationDays,
  affectedClasses,
  supportReasonFileUrl,
}: any) {
  const currentDate = dayjs().tz(timeZone).format("MMMM D, YYYY [at] h:mm A");

  const formattedFromDate = dayjs(fromDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, ddd");
  const formattedToDate = dayjs(toDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, ddd");

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
            background-color: #e3f2fd;
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
            color: #1a73e8;
            margin-bottom: 10px;
          }
          .leave-request {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .leave-details {
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .affected-classes {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .support-reason-file {
            background-color: #fce4ec;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .support-reason-file-title {
            font-weight: 600;
            color: #d81b60;
            margin-bottom: 10px;
          }
          @media (max-width: 600px) {
            .header {
              font-size: 24px;
            }
            .content {
              font-size: 14px;
            }
            .leave-request,
            .leave-details,
            .affected-classes,
            .support-reason-file {
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
              <p><strong>Date: </strong>${currentDate}</p>
              <p><strong>Dear Sir/Ma'am,</strong></p>
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

            <div class="support-reason-file">
              <div class="support-reason-file-title">Support Reason File:</div>
              <p>${
                supportReasonFileUrl
                  ? `<a href="${supportReasonFileUrl}" target="_blank">View Attached File</a>`
                  : "N/A"
              }</p>
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

// done
export function getLeaveRequestResponseEmailContent(
  leaveRequest: any,
  leaveStatus: any
) {
  const formattedFromDate = dayjs(leaveRequest.fromDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, ddd");
  const formattedToDate = dayjs(leaveRequest.toDate)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, ddd");

  const formattedAffectedClasses = leaveRequest.affectedClasses.length
    ? leaveRequest.affectedClasses
        .map((affectedClass: any) => affectedClass.affectedClassName)
        .join(", ")
    : "None";

  const supportReasonFile = leaveRequest.supportReasonFileUrl
    ? `<a href="${leaveRequest.supportReasonFileUrl}" target="_blank" style="color:#1e88e5;">View File</a>`
    : "N/A";

  const statusColor =
    leaveStatus.toLowerCase() === "approved" ? "#2e7d32" : "#c62828"; // Soft Green or Red

  const statusBackground =
    leaveStatus.toLowerCase() === "approved" ? "#e8f5e9" : "#ffebee"; // Light Green or Red

  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            color: #333;
            line-height: 1.6;
          }
          .container {
            width: 100%;
            max-width: 700px;
            margin: 20px auto;
            padding: 25px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .content-section {
            margin-bottom: 20px;
            padding: 20px;
            background-color: ${statusBackground};
            border-radius: 10px;
          }
          .content-section h3 {
            font-size: 20px;
            color: #1e88e5;
            margin-bottom: 12px;
          }
          .content-section p {
            font-size: 16px;
            margin-bottom: 10px;
          }
          .highlight {
            font-weight: bold;
            color: ${statusColor};
          }
          .details-section {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            font-size: 13px;
            color: #90a4ae;
            margin-top: 30px;
          }
          .footer a {
            color: #1e88e5;
            text-decoration: none;
          }
          @media (max-width: 600px) {
            .container {
              padding: 15px;
            }
            .content-section h3,
            .details-section h3 {
              font-size: 18px;
            }
            .content-section p,
            .details-section p {
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h2>Leave Request Response</h2>
          </div>

          <!-- Response Section -->
          <div class="content-section">
            <p><strong>Response Date:</strong> ${dayjs()
              .tz(timeZone)
              .format("MMMM D, YYYY [at] h:mm A")}</p>
            <p><strong>Applicant:</strong> ${leaveRequest.userName}</p>
            <p>The leave request has been <span class="highlight">${leaveStatus}</span>.</p>
          </div>

          <!-- Request Details Section -->
          <div class="details-section">
            <h3>Leave Request Details:</h3>
            <p><strong>Requested Date:</strong> ${dayjs(
              leaveRequest?.nepaliDate
            )
              .tz(timeZone)
              .format("MMMM D, YYYY [at] h:mm A")}</p>
            <p><strong>Subject:</strong> ${leaveRequest.leaveSubject}</p>
            <p><strong>Reason:</strong> ${leaveRequest.leaveReason}</p>
            <p><strong>Duration:</strong> ${formattedFromDate} - ${formattedToDate} (${
    leaveRequest.leaveDurationDays
  } days)</p>
            <p><strong>Affected Classes:</strong> ${formattedAffectedClasses}</p>
            <p><strong>Support Reason File:</strong> ${supportReasonFile}</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© Himalayan Chess Academy, All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// done
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
  classStudyMaterials = [],
}: any) {
  const currentDate = dayjs().tz(timeZone).format("MMMM D, YYYY [at] h:mm A");

  const formattedStartTime = dayjs(startTime)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, h:mm A");
  const formattedEndTime = dayjs(endTime)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, h:mm A");

  const assignedDate = dayjs(date)
    .tz("Asia/Kathmandu")
    .format("MMMM D, YYYY, h:mm A");

  // Updated Study Materials HTML
  const studyMaterialsContent = classStudyMaterials.length
    ? `

      ${classStudyMaterials
        .map(
          (material: any) => `
            <p style="margin: 6px 0;">
              ${material.fileName}
              —
              <a href="${material.fileUrl}" target="_blank" style="color: #1a73e8; text-decoration: none;">
                View File
              </a>
            </p>
          `
        )
        .join("")}
    `
    : `<p style="color: #888;">No study materials available.</p>`;

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
          a {
            color: #1a73e8;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
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

          <p><strong>Dear Sir/Ma'am,</strong></p>
          <p>A new class has been assigned with the following details:</p>
          <p><b>Notification Date: </b>${currentDate}</p>

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

          <div class="section">
            <div class="section-title">Study Materials</div>
            ${studyMaterialsContent}
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

// done
export function getBirthdayEmailContent({
  birthdayPeople,
  weekRange,
  currentUser,
}: any) {
  // Filter birthday people based on current user's permission
  let visibleBirthdayPeople = birthdayPeople;

  if (
    !currentUser.isGlobalAdmin &&
    currentUser.role.toLowerCase() !== "superadmin"
  ) {
    // If normal branch admin, only show people from their branch
    visibleBirthdayPeople = birthdayPeople.filter(
      (person: any) => person.branchName === currentUser.branchName
    );
  }

  // 1. Sort visibleBirthdayPeople by nearest birthday
  visibleBirthdayPeople = visibleBirthdayPeople.sort((a: any, b: any) => {
    const today = dayjs().tz(timeZone);

    const aBirthday = dayjs(a.dob).tz(timeZone).year(today.year());
    const bBirthday = dayjs(b.dob).tz(timeZone).year(today.year());

    let aDiff = aBirthday.diff(today, "day");
    let bDiff = bBirthday.diff(today, "day");

    // If already passed, consider next year
    if (aDiff < 0) {
      aDiff = dayjs(a.dob).tz(timeZone).add(1, "year").diff(today, "day");
    }
    if (bDiff < 0) {
      bDiff = dayjs(b.dob).tz(timeZone).add(1, "year").diff(today, "day");
    }

    return aDiff - bDiff;
  });

  // 2. Collect stats
  const totalBirthdays = visibleBirthdayPeople.length;

  const branchStats: Record<
    string,
    {
      total: number;
      students: number;
      admins: number;
      trainers: number;
      superadmin: number;
    }
  > = {};

  let hasSuperadminBirthday = false;

  visibleBirthdayPeople.forEach((person: any) => {
    const branch = person.branchName || "Unknown Branch";

    if (!branchStats[branch]) {
      branchStats[branch] = {
        total: 0,
        students: 0,
        admins: 0,
        trainers: 0,
        superadmin: 0,
      };
    }

    branchStats[branch].total += 1;

    if (person.extractedRole?.toLowerCase() === "student") {
      branchStats[branch].students += 1;
    } else if (person.role?.toLowerCase() === "admin") {
      branchStats[branch].admins += 1;
    } else if (person.role?.toLowerCase() === "trainer") {
      branchStats[branch].trainers += 1;
    } else if (person.role?.toLowerCase() === "superadmin") {
      branchStats[branch].superadmin += 1;
      hasSuperadminBirthday = true;
    }

    if (person.isGlobalAdmin) {
      hasSuperadminBirthday = true;
    }
  });

  const branchSummaryHTML = Object.entries(branchStats)
    .map(([branch, counts]) => {
      return `<li><strong>${branch}:</strong> ${counts.total} birthdays (Students: ${counts.students}, Admins: ${counts.admins}, Trainers: ${counts.trainers})</li>`;
    })
    .join("");

  // 3. Generate birthday list HTML
  const birthdayListHTML = visibleBirthdayPeople
    .map((person: any) => {
      const phone = person.phone || "N/A";
      const email = person.email || "N/A";
      const branch = person.branchName || "N/A";
      const dobFormatted = person.dob
        ? dayjs(person.dob).tz(timeZone).format("MMMM D, ddd")
        : "N/A";

      let roleDisplay = "N/A";
      if (person.extractedRole) {
        if (person.extractedRole.toLowerCase() === "student") {
          roleDisplay = "Student";
        } else if (person.extractedRole.toLowerCase() === "user") {
          roleDisplay = person.role || "N/A";
        }
      }

      const isSuperadmin =
        person.role?.toLowerCase() === "superadmin" || person.isGlobalAdmin;

      return `
        <div style="margin-bottom: 20px; ${
          isSuperadmin
            ? "background-color: #e6f7ff; padding: 10px; border: 2px solid blue; border-radius: 8px;"
            : ""
        }">
          <p class="person-name" style="font-size: 18px;">
            🎉 <strong ${isSuperadmin ? 'style="color: blue;"' : ""}>${
        person.name
      }</strong> ${
        isSuperadmin
          ? '<span style="font-size: 12px; background-color: blue; color: white; padding: 2px 6px; border-radius: 4px;">SUPERADMIN</span>'
          : ""
      }
          </p>
          <ul class="person-details" style="list-style-type: none; padding: 0;">
            <li><strong>Role:</strong> ${roleDisplay}</li>
            <li><strong>Birthday:</strong> ${dobFormatted}</li>
            <li><strong>Branch:</strong> ${branch}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
        </div>
      `;
    })
    .join("");

  const currentDateTime = dayjs().tz(timeZone).format("MMMM D, YYYY — hh:mm A");

  // 4. Return final HTML
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
          }
          .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .meta, .section {
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎂 Weekly Birthday Reminder</h1>
            ${
              hasSuperadminBirthday
                ? `<h2 style="color: blue;">✨ Superadmin Has Birthday This Week! ✨</h2>`
                : ""
            }
          </div>

          <div class="meta">
            <p><strong>Reminder Date:</strong> ${currentDateTime}</p>
            <p><strong>Birthday Week:</strong> ${weekRange}</p>
            <p><strong>Total Birthdays:</strong> ${totalBirthdays}</p>
          </div>

          <div class="section">
            <p><strong>Branch Summary:</strong></p>
            <ul>${branchSummaryHTML}</ul>

            <p>The following students/users have birthdays this week:</p>
            ${birthdayListHTML}
          </div>

          <p style="margin-top: 20px;">Let's wish them all a wonderful birthday! 🎉</p>
          <p><strong>Himalayan Chess Academy</strong></p>

          <div class="footer">
            &copy; Himalayan Chess Academy — All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}
