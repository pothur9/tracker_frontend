const crypto = require("crypto");

const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update("qicLcxQpuHC7J7iiO0SsqacnFUP+kMtVRwRlE+zuzxDopGv+SF2fwDil318J3UYZ")
  .digest();
// process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex"); // 32 bytes key
const IV_LENGTH = 16; // Initialization vector length

// Encrypt data
exports.encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// Decrypt data
exports.decrypt = (encryptedText) => {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedTextBytes = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedTextBytes);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
