const express = require("express");
const {
  getAllAirports,
  searchAirports,
} = require("../controllers/airports.controller");

const router = express.Router();

router.get("/", getAllAirports);

router.get("/search", searchAirports);

module.exports = router;
