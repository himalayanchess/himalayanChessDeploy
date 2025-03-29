import nodemailer from "nodemailer";

function getEmailContent(otp: any) {
  const emailContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            width: 100%;
            max-width: 600px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin: 0 auto;
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
          <div class="footer">
            <p>© Himalayan Chess Academy, All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailContent;
}

export async function sendOtpMail({ email, otp }: any) {
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
      subject: "OTP for Forgot Password",
      html: getEmailContent(otp),
    };
    const info = await transporter.sendMail(options);
    console.log("Email sent successfully");
    return info;
  } catch (error) {
    console.log("Error sending email", error);
  }
}
