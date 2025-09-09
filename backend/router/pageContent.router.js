const express = require("express");
const {
  createContent,
  updateContent,
  deleteContent,
  getContentById,
  getAllContentByPageId,
} = require("../controller/pageContent.controller");

const router = express.Router();

router.post("/createContent", createContent);
router.post("/updateContent/:id", updateContent);
router.get("/deleteContent/:id", deleteContent);
router.get("/getContentByPageId/:pageId", getAllContentByPageId);
router.get("/getContent/:id", getContentById);

module.exports = router;
