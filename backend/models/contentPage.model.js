const mongoose = require("mongoose");

const contentPageSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  pageTitle: { type: String, required: true },
  pageDescription: { type: String },
  pageLayout: { type: Number, default: 1 },

  pageContent: { type: mongoose.Schema.Types.ObjectId, ref: "PageContent" },

  isActive: { type: Boolean, default: true },
});

const ContentPage = mongoose.model("ContentPage", contentPageSchema);

module.exports = ContentPage;
