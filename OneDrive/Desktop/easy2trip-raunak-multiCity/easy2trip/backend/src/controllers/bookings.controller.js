const mongoose = require("mongoose");
const User = require("../models/user.model");
const { phoneToAlphabet } = require("./customer.controller");

async function addBooking(leadPassengerDetails, bookingId) {
  try {
    // Check if a user exists with the given phone number
    var encryptedPhone = phoneToAlphabet(leadPassengerDetails.contactNumber);
    let user = await User.findOne({ phoneNumber: encryptedPhone });

    if (user) {
      // If user exists, add the booking ID to the bookings array
      if (!user.bookings.includes(bookingId)) {
        user.bookings.push(bookingId);
        await user.save();
        console.log("Booking added to the existing user.");
      } else {
        console.log("Booking ID already exists for this user.");
      }
    } else {
      // If user does not exist, create a new user
      user = new User({
        profile: { name: leadPassengerDetails.name },

        loginDetails: { email: leadPassengerDetails.email },
        phoneNumber: encryptedPhone,
        bookings: [bookingId],
      });
      await user.save();
      console.log("New user created, and booking added.");
    }

    return user; // Return the updated or newly created user
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error; // Rethrow the error for further handling
  }
}

module.exports = addBooking;
