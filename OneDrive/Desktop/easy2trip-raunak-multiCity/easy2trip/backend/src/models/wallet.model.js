const mongoose = require("mongoose");

// Define the Wallet Schema
const walletSchema = new mongoose.Schema({
  balance: { type: Number, required: true, default: 0 }, // Total amount in the wallet
  type: {
    type: String,
    enum: ["full", "restricted"],
    required: true,
  }, // 'full' for fully redeemable, 'restricted' for admin-controlled redeemable
  redeemableAmount: { type: Number, default: 0 }, // For restricted wallets, the maximum redeemable amount
  lastUpdated: { type: Date, default: Date.now },
});

const Wallet = mongoose.model("wallet", walletSchema);

module.exports = Wallet;
