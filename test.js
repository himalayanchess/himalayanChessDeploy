const crypto = require("crypto");

// Generate a 256-bit (32 bytes) key
const key = crypto.randomBytes(32); // 32 bytes = 256 bits

// Display the key in hexadecimal format
console.log(key.toString("hex"));
