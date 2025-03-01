const mongoose = require("mongoose");

const workspaceBookingSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    payload: { type: Object, required: true },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    }, // Store organisation ID

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: String, default: null }, // Stores who approved/rejected the request
    confirmedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",

    },
  },
  { timestamps: true }
);

const WorkspaceBooking = mongoose.model(
  "WorkspaceBooking",
  workspaceBookingSchema
);

module.exports = WorkspaceBooking;
