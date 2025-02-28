const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    flag: { type: String, required: true },
    visa_fees: { type: mongoose.Schema.Types.Mixed, required: true }, //string and nunber
    charges: { type: Number, required: true }
  });

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;