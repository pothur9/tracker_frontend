const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["PMS", "AIF", "Mutual Fund"], required: true },
    amc: { type: mongoose.Schema.Types.ObjectId, ref: "AMC", required: true },
    fundManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FundManager",
      required: true,
    },
    logo: { type: String },
    badges: [{ type: String }], //  Featured, High Growth
    category: { type: String }, //  Large Cap Growth
    riskLevel: { type: String, enum: ["Low", "Moderate", "High"] },
    minInvestment: { type: String },
    aum: { type: String },
    inceptionDate: { type: Date },
    description: { type: String },
    performance: {
      "1Y": { type: Number },
      "3Y": { type: Number },
      "5Y": { type: Number },
      SI: { type: Number }, // Since inception
    },
    monthlyReturns: [
      {
        month: { type: String },
        return: { type: Number },
      },
    ],
    portfolioAllocation: [
      {
        name: { type: String },
        value: { type: Number },
        color: { type: String }, // for charts
      },
    ],
    keyMetrics: {
      sharpeRatio: { type: Number },
      maxDrawdown: { type: Number },
      beta: { type: Number },
      alpha: { type: Number },
    },
    strategy: { type: String }, //  Multi Cap & Flexi Cap
    benchmark: { type: String }, //  S&P BSE 500 TRI
    awards: [
      {
        title: { type: String },
        year: { type: Number },
        description: { type: String },
      },
    ],
    contactInfo: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    highlights: [{ title: { type: String }, description: { type: String } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fund", fundSchema);
