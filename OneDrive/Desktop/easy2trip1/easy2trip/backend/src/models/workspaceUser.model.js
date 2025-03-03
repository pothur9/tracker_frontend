const mongoose = require("mongoose");
const workspaceUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Organization email
  otp: { type: String }, // Hashed
  isVerified: { type: Boolean, default: false },
  profile: {
    name: { type: String },
    phoneNumber: { type: String }, // Optional
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const WorkspaceUser = mongoose.model("WorkspaceUser", workspaceUserSchema);

module.exports = WorkspaceUser;
