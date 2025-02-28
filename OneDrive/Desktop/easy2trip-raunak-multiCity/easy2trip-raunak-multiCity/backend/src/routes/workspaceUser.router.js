const express = require("express");
const {
  login,
  checkWorksapce,
  requestWorkspaceBooking,
  approveRejectBooking,
  getBookingsByOrganisation,
} = require("../controllers/workspaceUser.controller");
// const { addBooking } = require("../controllers/booking.controller");

const router = express.Router();

router.post("/login", login);
router.post("/checkWorksapce", checkWorksapce);
router.post("/requestWorkspaceBooking", requestWorkspaceBooking);
router.post("/approveRejectBooking", approveRejectBooking);
router.get("/org/:organisationId", getBookingsByOrganisation);

// router.post("/book", addBooking);

module.exports = router;
