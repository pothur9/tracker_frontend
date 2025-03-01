const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
  CITYNAME: { type: String, required: true },
  CITYCODE: { type: String, required: true },
  COUNTRYCODE: { type: String, required: true },
  COUNTRYNAME: { type: String, required: true },
  AIRPORTCODE: { type: String, required: true },
  AIRPORTNAME: { type: String, required: true },
});

module.exports = mongoose.model("Airport", airportSchema);
