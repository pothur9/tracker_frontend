const mongoose = require("mongoose");

require("dotenv").config();

const connect = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables");
  }
  return mongoose.connect(process.env.mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connect;
