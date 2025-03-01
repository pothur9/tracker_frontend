const User = require("../models/user.model");
const Organisation = require("../models/organisation.model");
const { sendOtp, verifyOtp } = require("../utils/otp.utlis"); // Utility functions for OTP
const WorkspaceBooking = require("../models/workspaceBookings.model");
const { bookFlight, ticketFlight } = require("./flight.controllerv1");
const { trace } = require("./user.controller");
const { result } = require("lodash");
const mongoose = require("mongoose");

exports.login = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const domain = email.split("@")[1];
    const approvedDomain = await Organisation.findOne({
      domain,
      isActive: true,
    });

    if (!approvedDomain) {
      return res
        .status(403)
        .json({ message: "Your organization is not tied up with us." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not exists
      user = new User({ email, userType: "workspace" });

      await user.save();
    }

    if (otp) {
      // Verify OTP
      const isValidOtp = verifyOtp(otp, user.otp); // Assuming OTP is hashed
      if (!isValidOtp) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      user.isVerified = true;
      await user.save();

      return res.status(200).json({
        message: "OTP verified successfully.",
        user: {
          email: user.email,
          usertype: user.userType,
          profile: user.profile,
          bookings: user.bookings,
        },
      });
    } else {
      // Send OTP
      const generatedOtp = sendOtp(email); // Sends and returns OTP
      user.otp = generatedOtp; // Save the hashed OTP
      await user.save();

      return res
        .status(200)
        .json({ message: "OTP sent successfully to your email." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login process." });
  }
};

exports.checkWorksapce = async (req, res) => {
  const { email } = req.body;

  try {
    const domain = email.split("@")[1];
    const approvedDomain = await Organisation.findOne({
      domain,
      isActive: true,
    });

    if (!approvedDomain) {
      return res.status(200).json({
        message: "Your organization is not tied up with us.",
        isOrgRegistered: false,
      });
    }

    return res.status(200).json({
      message: "Your organization is registered with us.",
      isOrgRegistered: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login process." });
  }
};

exports.requestWorkspaceBooking = async (req, res) => {
  const { email, payload } = req.body;

  try {
    const domain = email.split("@")[1];
    const approvedDomain = await Organisation.findOne({
      domain,
      isActive: true,
    });

    // Save booking request with "pending" approval status
    const booking = new WorkspaceBooking({
      email,
      organisationId: approvedDomain._id,
      payload: payload,
      status: "pending", // Initial status
      approvedBy: null, // No approver initially
    });
    await booking.save();

    if (!approvedDomain) {
      return res.status(403).json({
        message: "Your organization is not tied up with us.",
        isOrgRegistered: false,
      });
    }

    return res.status(200).json({
      message: "Booking request submitted successfully.",
      isOrgRegistered: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during booking process." });
  }
};

exports.approveRejectBooking = async (req, res) => {
  const { bookingId, status, approvedBy, amount } = req.body; // status: "approved" or "rejected"
  console.log(req.body);

  // Validate status
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  // Validate bookingId format
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: "Invalid booking ID format." });
  }

  try {
    // Find booking by _id
    console.log(bookingId);
    const booking = await WorkspaceBooking.findById(
      mongoose.Types.ObjectId(bookingId)
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking request not found." });
    }
    console.log(booking);
    var confirmedBookingId;
    const organisation = await Organisation.findById(booking.organisationId);

    // Check spending limit
    if (amount > organisation.currentLimit) {
      return res.status(400).json({ message: "Spending limit exceeded" });
    }

    if (booking.payload.isLCC) {
      req.body = {
        traceId: booking.payload.traceId,
        resultIndex: booking.payload.resultIndex,
        passenger: booking.payload.passenger,
      };
      console.log("TPO booking payload", req.body);

      await bookFlight(req, res);
      confirmedBookingId = await ticketFlight(req, res);
    } else {
      req.body = {
        traceId: booking.payload.traceId,
        resultIndex: booking.payload.resultIndex,
        passengers: booking.payload.passengers,
      };
      console.log("TPO booking payload", req.body);
      confirmedBookingId = await ticketFlight(req, res);
    }
    console.log("confirmedBookingId", confirmedBookingId);
    if (confirmedBookingId) {
      console.log("Organisation", organisation);
      organisation.currentLimit =
        organisation.currentLimit -
        confirmedBookingId.flightDetails.flightItinerary.fare.publishedFare;
      await organisation.save();

      // Update status and approver
      booking.status = status;
      booking.approvedBy = approvedBy;
      booking.confirmedBookingId = confirmedBookingId;
      await booking.save();
    }

    // return res.status(200).json({
    //   message: `Booking request ${status} successfully.`,
    // });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Error updating booking status." });
  }
};

exports.getBookingsByOrganisation = async (req, res) => {
  const { organisationId } = req.params;

  try {
    const bookings = await WorkspaceBooking.find({ organisationId });
    const organisation = await Organisation.findById(organisationId);

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this organisation." });
    }

    return res.status(200).json({ organisation, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings." });
  }
};
