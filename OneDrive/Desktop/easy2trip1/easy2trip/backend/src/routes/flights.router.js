const express = require("express");
const {
  searchFlights,
  bookFlight,
  ticketFlight,
  fareRule,
  fareQuote,
  getSSR,
  getFlightBokkingsdetails,
  ticketFlightSample,
  ticketFlightNonLcc,
} = require("../controllers/flight.controllerv1");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello");
});
router.post("/search", searchFlights);
// router.get("/:id", getFlightDetails);

router.post("/book", bookFlight);
router.post("/ticket", ticketFlight);
router.post("/ticketFlightNonLcc", ticketFlightNonLcc);
router.post("/fareRule", fareRule);
router.post("/fareQuote", fareQuote);
router.post("/getSsr", getSSR);
router.post("/getFlightBookings", getFlightBokkingsdetails);

router.post("/ticketFlightSample", ticketFlightSample);

// router.get("/:id/seats", getAvailableSeats);

module.exports = router;
