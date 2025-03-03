const Success = require("../models/success.model");
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const sendMail = require("../utils/sendmail");
const sendBookingConfirmation = require("../utils/flightbookinghtml");

// rauter.get("/:name", (req, res) => {
//   let regex = req.params.name;

//   Checkout.find({ user: regex }).then((result) => {
//     return res.status(200).json(result);
//   });
// });

router.get("/", async (req, res) => {
  // let regex = req.body.user;
  // const success = await Success.create(req.body);
  // let user = await User.find({ _id: regex });

  let html = sendBookingConfirmation({
    from: "your_email@gmail.com",
    to: "customer_email@example.com",
    subject: "Flight Booking Confirmation",
    bookingDetails: {
      bookingReference: "AB1234XYZ",
      passengerName: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "123-456-7890",
      flightNumber: "AA123",
      departureDateTime: "2025-02-01 10:00",
      departureAirport: "JFK",
      arrivalDateTime: "2025-02-01 13:00",
      arrivalAirport: "LAX",
      price: "299.99",
      paymentMethod: "Credit Card",
    },
  });
  sendMail({
    from: "dessaimakrand@gmail.com",
    to: "makrand19111998@gmail.com",
    subject: `Your Booking`,

    html: html,
  });
  return res.status(201).send({ mail: "success" });
});

module.exports = router;
