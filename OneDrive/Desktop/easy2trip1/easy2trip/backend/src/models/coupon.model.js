const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  description: String,
  discountPercentage: Number,
  maxDiscount: Number,
  minBookingAmount: Number,
  expiryDate: Date,
  applicableAirlines: [String], // List of airlines the coupon applies to
  termsAndConditions: String,
});

module.exports = mongoose.model("Coupon", couponSchema);
