const managerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String },
    experience: { type: Number },
    bio: { type: String },
    amc: { type: mongoose.Schema.Types.ObjectId, ref: "AMC" },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FundManager", managerSchema);
