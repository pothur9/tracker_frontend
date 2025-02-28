import mongoose from 'mongoose';

// MongoDB Schema and Model
const hotelSchema = new mongoose.Schema({
  HotelCode: String,
  HotelName: String,
  HotelRating: String,
  Address: String,
  Attractions: Array,
  CountryName: String,
  CountryCode: String,
  Description: String,
  FaxNumber: String,
  HotelFacilities: Array,
  Map: String,
  PhoneNumber: String,
  PinCode: String,
  HotelWebsiteUrl: String,
  CityName: String,
  CheckInTime: String,
  CheckOutTime: String,
  Images: Array,
  UpdatedAt: { type: Date, default: Date.now },
});
const Hotels = mongoose.models.Hotel || mongoose.model("Hotel", Hotel);

export default Hotels;
