const Bookings = require("../models/booking.model");
const mongoose = require("mongoose");

exports.getInternalBookingController = async (req, res) => {
    const { bookingId } = req.body; // Extract the bookingId from the request body
  
    try {
      // Fetch the booking from the database using the provided bookingId
      const booking = await Bookings.findById(mongoose.Types.ObjectId(bookingId));
  
      // Check if the booking exists
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
  
   
  
      // Send the fareRule as a response
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      // Catch any unexpected errors and send a response with status 500
      res.status(500).json({ message: "An error occurred while fetching the booking details." });
    }
  };