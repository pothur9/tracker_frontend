const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contentPageRoutes = require("./router/contentPage.router");
const pageContentRoutes = require("./router/pageContent.router");
const connectDB = require("./utils/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/contentPage", contentPageRoutes);
app.use("/api/pageContent", pageContentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  connectDB();
});
