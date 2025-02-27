export function generateRandomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?";
  let randomPassword = "";

  for (let i = 0; i < length; i++) {
    randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return randomPassword;
}
