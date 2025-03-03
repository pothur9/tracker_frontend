const mongoose = require("mongoose");

const tokensSchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // Expiration timestamp
  logs: [
    {
      action: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      details: { type: String },
    },
  ],
});

const Tokens = mongoose.model("Tokens", tokensSchema);

module.exports = Tokens;
