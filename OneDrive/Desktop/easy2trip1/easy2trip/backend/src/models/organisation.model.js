const mongoose = require("mongoose");

const organisationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Organisation Name
  domain: { type: String, required: true, unique: true }, // E.g., "company.com"
  spendingLimit: { type: Number, required: true }, // Maximum spending limit for bookings
  currentLimit: { type: Number, required: true },
  paymentInterval: {
    type: Number,
    enum: [15, 30, 45],
    required: true,
  }, // Invoicing period (days)
  paymentDueDate: { type: Number, required: true }, // Day of the month (e.g., 15th)
  isActive: { type: Boolean, default: true }, // Subscription status
  createdAt: { type: Date, default: Date.now },

  // Invoice history
  invoices: [
    {
      invoiceDate: { type: Date, required: true }, // Date invoice was generated
      startDate: { type: Date, required: true }, // Start of the invoice period
      endDate: { type: Date, required: true }, // End of the invoice period
      amount: { type: Number, required: true }, // Total invoice amount
      status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
      bookings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking", // Reference to the booking
        },
      ],
    },
  ],

  // Organisation bookings
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

module.exports = mongoose.model("Organisation", organisationSchema);
