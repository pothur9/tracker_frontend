const express = require("express");
const {
  sendOTP,
  validateOTP,
  updateUser,
} = require("../controllers/customer.controller");

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", validateOTP);
router.post("/update-profile", updateUser);
// router.get("/profile", getProfile);

module.exports = router;
