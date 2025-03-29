export const generateOTP = (length: any) => {
  if (length <= 0) throw new Error("Length must be greater than 0");
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
};
