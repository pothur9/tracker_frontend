const mongoose = require("mongoose");

const userCouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // The discount value (e.g., percentage or fixed)
  description: { type: String },
  expirationDate: { type: Date },
  status: { type: String, enum: ["active", "expired"], default: "active" },
});

const UserCoupon = mongoose.model("UserCoupon", userCouponSchema);

module.exports = UserCoupon;
