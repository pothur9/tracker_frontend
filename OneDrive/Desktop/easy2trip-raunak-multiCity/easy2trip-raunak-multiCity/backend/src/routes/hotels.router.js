const express = require("express");
const {
  searchHotels,
  searchHotelsFromApi,
  preBook,
  hotelBook,
  getBookingDetail,
  hotelBookV1,
  getHotelRoom,
  getHotelInfo,
  blockRoom,
} = require("../controllers/hotel.controllerv1");

const router = express.Router();

router.post("/search", searchHotels);
router.get("/searchHotelByLocation", searchHotelsFromApi);
// router.post("/preBook", preBook);
router.post("/blockRoom", blockRoom);
router.post("/getHotelInfo", getHotelInfo);
router.post("/getHotelRoom", getHotelRoom);
router.post("/book", hotelBook);
// router.post("/book/v1", hotelBookV1);
router.post("/getBookingDetails", getBookingDetail);

module.exports = router;
