const express = require("express");
const {
    getInternalBookingController
} = require("../controllers/internalFlight.controller");

const router = express.Router();

router.post("/getInternalBooking", getInternalBookingController);

module.exports = router;