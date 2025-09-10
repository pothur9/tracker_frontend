const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    title: { type: String },
    image: { type: String },
    description: { type: String },
    layout: { type: Number, default: 1 },
    metatitle: { type: String },
    metadescription: { type: String },
    slug: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: "ContentPage" },
  },
  { timestamps: true }
);

const PageContent = mongoose.model("PageContent", pageContentSchema);

module.exports = PageContent;
