const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  specialServices: {
    type: [String],
    default: [],
  },
  baggage: {
    checked: {
      type: String,
      default: "0kg",
    },
    cabin: {
      type: String,
      default: "0kg",
    },
  },
});

const FareBreakdownSchema = new mongoose.Schema({
  baseFare: {
    type: Number,
    required: true,
  },
  taxes: {
    type: Number,
    required: true,
  },
  totalFare: {
    type: Number,
    required: true,
  },
  taxBreakup: {
    type: Map,
    of: Number,
    default: {},
  },
});

const bookingSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["flight", "hotel"] }, // Type of booking
  // bookingId: { type: String, required: true, unique: true }, // Unique booking identifier
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
  },

  // Flight-specific details
  flightDetails: {},

  // Hotel-specific details
  hotelDetails: {
    hotelName: { type: String },
    city: { type: String },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    rooms: [
      {
        roomType: { type: String }, // E.g., Deluxe, Standard
        guests: [
          {
            name: { type: String }, // Encrypted
            gender: { type: String },
            age: { type: Number },
          },
        ],
      },
    ],
  },
  paymentDetails: {
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "wallet", "UPI", "netbanking"],
    },
    transactionId: { type: String },
  },

  createdAt: { type: Date, default: Date.now },
});

const Bookings = mongoose.model("bookings", bookingSchema);

module.exports = Bookings;
