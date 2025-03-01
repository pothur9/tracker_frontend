const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  airline: String,
  fromCity: String,
  toCity: String,
  departureDate: Date,
  returnDate: Date,
  stops: Number,
  class: String,
  price: Number,
  availableSeats: Number,
  flightNumber: String,
  aircraftType: String,
  departureTime: String,
  arrivalTime: String,
  layoverInfo: String,
  terminal: String,
  amenities: [String],
});
module.exports = mongoose.model("Flight", flightSchema);
