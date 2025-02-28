const express = require("express");
const { getCoupons } = require("../controllers/coupon.controller");

const router = express.Router();

router.get("/", getCoupons);

module.exports = router;
