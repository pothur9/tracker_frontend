const express = require("express");
const {
  adminLogin,
  getAllCustomers,
  getAllBookings,
  createCoupons,
  pushCashToWallet,
  createAdmin,
} = require("../controllers/admin.controller");

const {
  addDomain,
  getDomains,
  deleteDomain,
} = require("../controllers/organisation.controller");

const router = express.Router();

router.post("/domains", addDomain);
router.get("/domains", getDomains);
router.delete("/domains", deleteDomain);
router.post("/login", adminLogin);
router.post("/register", createAdmin);
router.get("/customers", getAllCustomers);
router.get("/bookings", getAllBookings);
router.post("/coupons", createCoupons);
router.post("/wallet/cash", pushCashToWallet);

module.exports = router;
