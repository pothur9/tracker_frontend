const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true }, // Encrypted
  otp: { type: String }, // Hashed
  isVerified: { type: Boolean, default: false },
  profile: {
    name: { type: String }, // Encrypted
    birthday: { type: String }, // Encrypted
    gender: { type: String },
    maritalStatus: { type: String },
    address: { type: String }, // Encrypted
    pincode: { type: String },
    state: { type: String },
  },
  loginDetails: {
    email: { type: String }, // Encrypted
    password: { type: String }, // Use bcrypt for hashing
  },
  coTravellers: [
    {
      title: { type: String },
      name: { type: String }, // Encrypted
      gender: { type: String },
      age: { type: Number },
      dob: { type: String }, // Encrypted
    },
  ],
  coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
  wallets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  userType: { type: String, enum: ["normal", "workspace"], default: "normal" }, // Added field
});
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default  User;
