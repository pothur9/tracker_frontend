const express = require("express");
const connect = require("./config/db");
const path = require("path");
const cron = require("node-cron");

const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.port;

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
app.use(express.json());

// app.use(cors({ origin: `http://localhost:${port}`, credentials: true }));
app.use(cors());
let userController = require("./controllers/user.controller");
let checkoutController = require("./controllers/checkout.controller");
let orderController = require("./controllers/order.controller");
let paymentController = require("./controllers/payment.controller");
let SuccessController = require("./controllers/success.controller");
const flightRoutes = require("./routes/flights.router");
const couponRoutes = require("./routes/coupon.router");
const hotelRoutes = require("./routes/hotels.router");
const airportRoutes = require("./routes/airports.router");
const userRoutes = require("./routes/user.router");
const adminRoutes = require("./routes/admin.router");
const evisaRoutes = require("./routes/evisa.router");
const organisationRoutes = require("./routes/organisation.router");
const internalBooking = require("./routes/internalBooking.router");
let imagesContoller = require("./controllers/images.controller");

const workspaceRoutes = require("./routes/workspaceUser.router");

const { checkAndUpdateToken } = require("../src/controllers/tokens.controller");
const { processHotels } = require("./controllers/hotel.controller");

app.use(express.static(path.join(__dirname, "public")));

app.use("/images", imagesContoller);
app.use("/users", userController);
app.use("/checkout", checkoutController);
app.use("/order", orderController);
app.use("/razorpay", paymentController);
app.use("/success", SuccessController);
app.use("/evisa", evisaRoutes);
app.use("/api/flight", flightRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organisation", organisationRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/internalBooking", internalBooking);

const start = async () => {
  await connect();
  cron.schedule(
    "1 12 * * *",
    async () => {
      console.log("Running checkAndUpdateToken at 12:00:01 PM IST");
      await checkAndUpdateToken();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // Set timezone to India Standard Time (IST)
    }
  );
  await checkAndUpdateToken();

  // processHotels("IN");
  app.use((req, res, next) => {
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);
    next();
  });

  const server = app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
  );

  // Increase timeout settings
  server.keepAliveTimeout = 300000;
  server.headersTimeout = 305000;
};

module.exports = start;
