"use strict";

var express = require("express");

var _require = require("../controllers/flight.controllerv1"),
    searchFlights = _require.searchFlights,
    bookFlight = _require.bookFlight,
    ticketFlight = _require.ticketFlight,
    fareRule = _require.fareRule,
    fareQuote = _require.fareQuote,
    getSSR = _require.getSSR;

var router = express.Router();
router.post("/search", searchFlights); // router.get("/:id", getFlightDetails);

router.post("/book", bookFlight);
router.post("/ticket", ticketFlight);
router.post("/fareRule", fareRule);
router.post("/fareQuote", fareQuote);
router.post("/getSsr", getSSR); // router.post("/getFlightBookings", getFlightBokkingsdetails);
// router.get("/:id/seats", getAvailableSeats);

module.exports = router;