const crypto = require("crypto");

const sendOtp = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  // Simulate sending OTP (e.g., via email or SMS)
  console.log(`OTP sent to ${email}: ${otp}`);

  return hashedOtp; // Return hashed OTP
};

const verifyOtp = (enteredOtp, storedOtp) => {
  const hashedEnteredOtp = crypto
    .createHash("sha256")
    .update(enteredOtp)
    .digest("hex");
  return hashedEnteredOtp === storedOtp;
};

module.exports = { sendOtp, verifyOtp };
