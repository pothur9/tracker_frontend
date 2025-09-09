const express = require("express");
const {
  createPage,
  deletePage,
  updatePage,
  getAllPages,
  getPageByRouteId,
} = require("../controller/contentPage.controller");
const router = express.Router();

router.post("/create", createPage);
router.get("/delete/:id", deletePage);
router.post("/update/:id", updatePage);
router.get("/getAllPages", getAllPages);
router.get("/getPage/:routeId", getPageByRouteId);

module.exports = router;
