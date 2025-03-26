import bcrypt from "bcryptjs";

const storeHashedPassword = async (password) => {
  // Generate salt and hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Simulate storing it in a database (just an example)
  // In real-world apps, save `hashedPassword` in your DB.
  return hashedPassword;
};

// Example usage
const text = "trainer";
storeHashedPassword(text).then((hashed) => console.log("Hashed Text:", hashed));
