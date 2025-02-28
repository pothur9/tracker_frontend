const express = require("express");
const router = express.Router();
const { getSignedURL } = require("../controllers/evisa.controller");

router.get("/generate-presigned-url", getSignedURL);

module.exports = router;