const express = require("express");
const {
  createOrganisation,
  createOrganisationBooking,
  generateInvoices,
  pauseOrganisation,
  getInvoices,
} = require("../controllers/organisation.controller");

const router = express.Router();

router.post("/create", createOrganisation);
router.post("/booking", createOrganisationBooking);
router.post("/generate-invoices", generateInvoices);
router.post("/pause", pauseOrganisation);
router.get("/:organisationId/invoices", getInvoices);

module.exports = router;
