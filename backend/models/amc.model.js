const mongoose = require("mongoose");

const amcSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // AMC Name
    logo: { type: String }, // AMC Logo URL
    foundedYear: { type: Number }, // Year AMC was founded
    headquarters: { type: String }, // HQ location
    totalAUM: { type: String }, // e.g., ₹5,000 Cr
    numberOfClients: { type: Number }, // Number of clients
    description: { type: String }, // Short description
    contactInfo: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
      address: { type: String },
    },
    awards: [
      {
        title: { type: String },
        year: { type: Number },
        description: { type: String },
      },
    ],
    fundManagers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FundManager", // link to Fund Manager collection
      },
    ],
    funds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fund", // link to Funds under this AMC
      },
    ],
    ratings: {
      crisil: { type: Number },
      icra: { type: Number },
      morningstar: { type: Number },
    },
    socialMedia: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },
    keyHighlights: [{ title: { type: String }, description: { type: String } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AMC", amcSchema);
