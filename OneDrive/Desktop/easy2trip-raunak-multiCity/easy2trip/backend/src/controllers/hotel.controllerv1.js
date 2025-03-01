const Hotel = require("../models/hotels.model");
const axios = require("axios");
const Tokens = require("../models/tokens.model");

const API_HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Basic VEJPU3RhdGljQVBJVGVzdDpUYm9AMTE1MzA4MTg=", // Replace with your actual API key
};

// API Endpoints
const CITY_LIST_API =
  "https://api.tbotechnology.in/TBOHolidays_HotelAPI/CityList";
const HOTEL_CODE_API =
  "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList";
const HOTEL_DETAILS_API =
  "http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails";

// Utility function to delay requests (rate-limiting)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch city list
const fetchCityList = async (countryCode) => {
  const response = await axios.post(
    CITY_LIST_API,
    { CountryCode: countryCode },
    { headers: API_HEADERS }
  );
  return response.data.CityList;
};

// Fetch hotel codes for a city
const fetchHotelCodes = async (cityCode) => {
  const response = await axios.post(
    HOTEL_CODE_API,
    { CityCode: cityCode, IsDetailedResponse: true },
    { headers: API_HEADERS }
  );
  return response.data;
};

// Fetch hotel details for a specific hotel
const fetchHotelDetails = async (hotelCode) => {
  const response = await axios.post(
    HOTEL_DETAILS_API,
    { Hotelcodes: hotelCode, Language: "EN" },
    { headers: API_HEADERS }
  );
  return response.data;
};

const saveOrUpdateHotel = async (hotelData) => {
  await Hotel.findOneAndUpdate({ HotelCode: hotelData.HotelCode }, hotelData, {
    upsert: true,
  });
};

// Main Function¸¸
exports.processHotels = async (countryCode) => {
  try {
    console.log("Fetching city list...");
    const cityList = await fetchCityList(countryCode);
    console.log("cityList", cityList);
    for (const city of cityList) {
      console.log(`Processing city: ${city.Name} (Code: ${city.Code})`);

      // Fetch hotel codes for the city
      const hotelCodeResponse = await fetchHotelCodes(city.Code);
      const hotels = hotelCodeResponse.Hotels;
      const { Status, Hotels } = hotelCodeResponse;

      if (Status?.Code === 200 && Array.isArray(Hotels)) {
        for (const hotel of hotels) {
          console.log(
            `Fetching details for hotel: ${hotel.HotelName} (Code: ${hotel.HotelCode})`
          );

          // Fetch detailed hotel information
          const hotelDetailsResponse = await fetchHotelDetails(hotel.HotelCode);
          const { HotelDetails } = hotelDetailsResponse;

          // Save or update hotel details in MongoDB
          if (Array.isArray(HotelDetails) && HotelDetails.length > 0) {
            const hotelDetails = hotelDetailsResponse.HotelDetails[0];

            if (hotelDetails) {
              await saveOrUpdateHotel(hotelDetails);
              console.log(`Saved/Updated hotel: ${hotelDetails.HotelName}`);
            }
          }
          // Optional: Add a delay to prevent hitting rate limits
          await delay(500);
        }
      }
    }

    console.log("Processing complete!");
  } catch (error) {
    console.error("Error processing hotels:", error.message);
  }
};

exports.searchHotelsFromApi = async (req, res) => {
  try {
    const { keyword } = req.query;
    let query = {
      CityName: new RegExp(keyword, "i"),
    };

    const hotels = await Hotel.find(query);

    if (!hotels.length) {
      return res
        .status(404)
        .json({ message: "No hotels found for the given criteria." });
    }
    console.log("hotels:", hotels.length);

    const formattedHotels = hotels.map((hotel) => ({
      name: hotel.HotelName,
      code: hotel.HotelCode,
      checkInTime: hotel.CheckInTime,
      checkOutTime: hotel.CheckOutTime,
      images: hotel.Images,
      attractions: hotel.Attractions,
      hotelRating: hotel.HotelRating,
      description: hotel.Description,
      phoneNumber: hotel.PhoneNumber,
      pinCode: hotel.PinCode,
      faxNumber: hotel.FaxNumber,
      hotelWebsiteUrl: hotel.HotelWebsiteUrl,
      city: hotel.CityName,
      countryCode: hotel.CountryCode,
      countryName: hotel.CountryName,
      address: hotel.Address,
      map: hotel.Map,
    }));

    res.json(formattedHotels);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for hotels." });
  }
};

exports.searchHotels = async (req, res) => {
  const {
    location,

    checkIn,
    checkOut,
    guestNationality,
    noOfRooms,
    paxRooms,
    page = 1,
    limit = 500,
    cityId,
  } = req.body;

  try {
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    // if (
    //   children > 0 &&
    //   (!Array.isArray(childrenAges) || childrenAges.length !== children)
    // ) {
    //   return res.status(400).json({
    //     message: "Invalid input. Please provide ages for all children.",
    //   });
    // }

    // let query = {
    //   CityName: new RegExp(location, "i"),
    // };

    // const skip = (page - 1) * limit;
    // const hotels = await Hotel.find(query);
    // console.log("hotels.length", hotels.length);

    // if (!hotels.length) {
    //   return res
    //     .status(404)
    //     .json({ message: "No hotels found for the given criteria." });
    // }

    // let hotelCodes = hotels.map((hotel) => hotel.HotelCode);

    // const chunkArray = (arr, size) => {
    //   return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    //     arr.slice(i * size, i * size + size)
    //   );
    // };

    // const hotelCodeChunks = chunkArray(hotelCodes, 100);

    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
    };

    const apiUrl =
      "https://HotelBE.tektravels.com/hotelservice.svc/rest/Gethotelresult";

    let allHotelResults = [];
    const tokenData = await Tokens.findOne();
    const dateCheckInDate = new Date(checkIn);
    const formattedDateCheckInDate = new Intl.DateTimeFormat("en-GB").format(
      dateCheckInDate
    );
    const dateCheckOutDate = new Date(checkIn);
    const formattedDateCheckOutDate = new Intl.DateTimeFormat("en-GB").format(
      dateCheckOutDate
    );
    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const fetchHotels = async () => {
      try {
        console.log(
          "hotelCodeChunk",
          JSON.stringify({
            CheckInDate: formattedDateCheckInDate,
            CheckOutDate: formattedDateCheckOutDate,
            NoOfNights: nights.toString(),
            CountryCode: "IN",
            CityId: cityId,
            ResultCount: null,
            PreferredCurrency: "INR",
            GuestNationality: "IN",
            NoOfRooms: noOfRooms,
            RoomGuests: paxRooms,
            MaxRating: 5,
            MinRating: 0,
            ReviewScore: null,
            IsNearBySearchAllowed: false,
            EndUserIp: "123.1.1.1",
            TokenId: tokenData.tokenId,
          })
        );
        const response = await axios.post(
          apiUrl,
          {
            CheckInDate: formattedDateCheckInDate,
            CheckOutDate: formattedDateCheckOutDate,
            NoOfNights: nights,
            CountryCode: "IN",
            CityId: cityId,
            ResultCount: null,
            PreferredCurrency: "INR",
            GuestNationality: "IN",
            NoOfRooms: noOfRooms,
            RoomGuests: paxRooms,
            MaxRating: 5,
            MinRating: 0,
            ReviewScore: null,
            IsNearBySearchAllowed: false,
            EndUserIp: "123.1.1.1",
            TokenId: tokenData.tokenId,
          },
          { headers }
        );
        console.log("Search Hotel", JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        return [];
      }
    };
    const hotelResults = await fetchHotels();

    // for (const hotelCodeChunk of hotelCodeChunks) {
    //   const hotelResults = await fetchHotels(hotelCodeChunk);
    //   allHotelResults = allHotelResults.concat(hotelResults.HotelResult || []);
    // }

    // const paginatedResults = allHotelResults.slice(skip, skip + limit);
    // const formattedHotels = paginatedResults.map((hotel) => ({
    //   ...hotel,
    // }));

    // const hotelMap = new Map(hotels.map((hotel) => [hotel.HotelCode, hotel]));

    // // Merge API response with MongoDB data
    // const mergedHotels = paginatedResults.map((apiHotel) => {
    //   const mongoHotel = hotelMap.get(apiHotel.HotelCode);

    //   return mongoHotel
    //     ? { ...mongoHotel.toObject(), ...apiHotel } // Combine both objects
    //     : apiHotel; // If not found in MongoDB, return API hotel as is
    // });
    // Return response
    res.json({
      ...hotelResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while searching for hotels.",
      error: error.message,
    });
  }
};

exports.preBook = async (req, res) => {
  const { bookingCode } = req.body;

  try {
    if (!bookingCode) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
    };

    const apiUrl = "https://affiliate.tektravels.com/HotelAPI/PreBook";

    const preBooking = async () => {
      try {
        const response = await axios.post(
          apiUrl,
          {
            BookingCode: bookingCode,
          },
          { headers }
        );
        console.log("PreBook Hotel ", JSON.stringify(response.data));
        res.json({
          data: response.data,
        });
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        res.status(500).json({
          message: "An error occurred while prebooking from tpo.",
          error: error,
        });
      }
    };
    return preBooking();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while  prebooking from server.",
      error: error.message,
    });
  }
};
exports.getHotelInfo = async (req, res) => {
  const { resultIndex, hotelCode, traceId, categoryId } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    if ((!resultIndex, !hotelCode, !traceId)) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
    };

    const apiUrl =
      "https://HotelBE.tektravels.com/hotelservice.svc/rest//GetHotelInfo";

    const preBooking = async () => {
      try {
        const response = await axios.post(
          apiUrl,

          {
            EndUserIp: "192.168.9.119",
            // RequestedBookingMode: 5,
            ResultIndex: resultIndex,
            HotelCode: hotelCode,
            TokenId: tokenData.tokenId,
            TraceId: traceId,
            CategoryId: categoryId,
          },

          { headers }
        );
        console.log("GetHotelRoom", JSON.stringify(response.data));
        res.json({
          data: response.data,
        });
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        res.status(500).json({
          message: "An error occurred while prebooking from tpo.",
          error: error,
        });
      }
    };
    return preBooking();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while  prebooking from server.",
      error: error.message,
    });
  }
};
exports.getHotelRoom = async (req, res) => {
  const { resultIndex, hotelCode, traceId } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    if ((!resultIndex, !hotelCode, !traceId)) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
    };

    const apiUrl =
      "https://HotelBE.tektravels.com/hotelservice.svc/rest/GetHotelRoom";

    const preBooking = async () => {
      try {
        const response = await axios.post(
          apiUrl,

          {
            EndUserIp: "192.168.9.119",
            // RequestedBookingMode: 5,
            ResultIndex: resultIndex,
            HotelCode: hotelCode,
            TokenId: tokenData.tokenId,
            TraceId: traceId,
          },

          { headers }
        );
        console.log("GetHotelRoom", JSON.stringify(response.data));
        res.json({
          data: response.data,
        });
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        res.status(500).json({
          message: "An error occurred while prebooking from tpo.",
          error: error,
        });
      }
    };
    return preBooking();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while  prebooking from server.",
      error: error.message,
    });
  }
};

exports.blockRoom = async (req, res) => {
  const {
    resultIndex,
    hotelCode,
    hotelName,
    noOfRooms,
    hotelRoomsDetails,
    traceId,
  } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    if (!hotelRoomsDetails) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
    };

    const apiUrl =
      "https://HotelBE.tektravels.com/hotelservice.svc/rest/blockRoom";

    const preBooking = async () => {
      try {
        const response = await axios.post(
          apiUrl,

          {
            ResultIndex: resultIndex,
            HotelCode: hotelCode,
            HotelName: hotelName,
            GuestNationality: "IN",
            NoOfRooms: noOfRooms,
            ClientReferenceNo: "0",
            IsVoucherBooking: "true",
            HotelRoomsDetails: hotelRoomsDetails,
            // [
            //   {
            //     RoomIndex: "1",
            //     RoomTypeCode: "SB|0|0|1",
            //     RoomTypeName: "Standard Single",
            //     RatePlanCode: "001:TUL5:18178:S17929:24963:98679|1",
            //     BedTypeCode: null,
            //     SmokingPreference: 0,
            //     Supplements: null,
            //     Price: {
            //       CurrencyCode: "INR",
            //       RoomPrice: "4620.0",
            //       Tax: "0.0",
            //       ExtraGuestCharge: "0.0",
            //       ChildCharge: "0.0",
            //       OtherCharges: "0.0",
            //       Discount: "0.0",
            //       PublishedPrice: "4620.0",
            //       PublishedPriceRoundedOff: "4620",
            //       OfferedPrice: "4620.0",
            //       OfferedPriceRoundedOff: "4620",
            //       AgentCommission: "0.0",
            //       AgentMarkUp: "0.0",
            //       TDS: "0.0",
            //     },
            //   },
            // ],
            EndUserIp: "123.1.1.1",
            TokenId: tokenData.tokenId,
            TraceId: traceId,
          },

          { headers }
        );
        console.log("Hotel Book", JSON.stringify(response.data));
        res.json({
          data: response.data,
        });
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        res.status(500).json({
          message: "An error occurred while prebooking from tpo.",
          error: error,
        });
      }
    };
    return preBooking();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while  prebooking from server.",
      error: error.message,
    });
  }
};

exports.hotelBook = async (req, res) => {
  const {
    resultIndex,
    hotelCode,
    hotelName,
    noOfRooms,
    hotelRoomsDetails,
    traceId,
  } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    if (!hotelRoomsDetails) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
    };

    const apiUrl = "https://HotelBE.tektravels.com/hotelservice.svc/rest/book";

    const preBooking = async () => {
      try {
        const response = await axios.post(
          apiUrl,

          {
            ResultIndex: resultIndex,
            HotelCode: hotelCode,
            HotelName: hotelName,
            GuestNationality: "IN",
            NoOfRooms: noOfRooms,
            ClientReferenceNo: "0",
            IsVoucherBooking: "true",
            HotelRoomsDetails: hotelRoomsDetails,
            // [
            //   {
            //     RoomIndex: "1",
            //     RoomTypeCode: "SB|0|0|1",
            //     RoomTypeName: "Standard Single",
            //     RatePlanCode: "001:TUL5:18178:S17929:24963:98679|1",
            //     BedTypeCode: null,
            //     SmokingPreference: 0,
            //     Supplements: null,
            //     Price: {
            //       CurrencyCode: "INR",
            //       RoomPrice: "4620.0",
            //       Tax: "0.0",
            //       ExtraGuestCharge: "0.0",
            //       ChildCharge: "0.0",
            //       OtherCharges: "0.0",
            //       Discount: "0.0",
            //       PublishedPrice: "4620.0",
            //       PublishedPriceRoundedOff: "4620",
            //       OfferedPrice: "4620.0",
            //       OfferedPriceRoundedOff: "4620",
            //       AgentCommission: "0.0",
            //       AgentMarkUp: "0.0",
            //       TDS: "0.0",
            //     },
            //   },
            // ],
            EndUserIp: "123.1.1.1",
            TokenId: tokenData.tokenId,
            TraceId: traceId,
          },

          { headers }
        );
        console.log("Hotel Book", JSON.stringify(response.data));
        res.json({
          data: response.data,
        });
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        res.status(500).json({
          message: "An error occurred while prebooking from tpo.",
          error: error,
        });
      }
    };
    return preBooking();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while  prebooking from server.",
      error: error.message,
    });
  }
};
// exports.hotelBookV1 = async (req, res) => {
//   const { bookingCode, guestNationality, netAmount, hotelRoomsDetails } =
//     req.body;

//   console.log("hotelRoomsDetails", hotelRoomsDetails);
//   try {
//     // if ((!bookingCode, !guestNationality, !netAmount, !hotelRoomsDetails)) {
//     //   return res.status(400).json({
//     //     message: "Invalid input. Please provide all required fields.",
//     //   });
//     // }

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
//     };

//     const apiUrl = "https://HotelBE.tektravels.com/hotelservice.svc/rest/book";

//     const preBooking = async () => {
//       try {
//         const response = await axios.post(
//           apiUrl,

//           {
//             BookingCode: bookingCode,
//             IsVoucherBooking: false,
//             GuestNationality: guestNationality,
//             EndUserIp: "192.168.9.119",
//             // RequestedBookingMode: 5,
//             NetAmount: netAmount,

//             HotelRoomsDetails: hotelRoomsDetails,
//           },

//           { headers }
//         );
//         console.log("response.data.HotelResult", response);
//         res.json({
//           data: response.data,
//         });
//       } catch (error) {
//         console.error("Error fetching hotel data:", error);
//         res.status(500).json({
//           message: "An error occurred while prebooking from tpo.",
//           error: error,
//         });
//       }
//     };
//     return preBooking();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "An error occurred while  prebooking from server.",
//       error: error.message,
//     });
//   }
// };

exports.getBookingDetail = async (req, res) => {
  const { bookingId, traceId } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    // if (!bookingId) {
    //   return res.status(400).json({
    //     message: "Invalid input. Please provide all required fields.",
    //   });
    // }

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic S2F2aXRoYTpLYXZpdGhhQDEyMzQ=",
    };

    const apiUrl =
      "http://HotelBE.tektravels.com/internalhotelservice.svc/rest/GetBookingDetail";

    const preBooking = async () => {
      try {
        const response = await axios.post(
          apiUrl,
          {
            BookingId: bookingId,
            EndUserIp: "192.168.0.0",
            TokenId: tokenData.tokenId,
            ...(traceId ? { TraceId: traceId } : { BookingId: bookingId }),
          },
          { headers }
        );
        console.log("GetBookingDetail", response);
        res.json({
          data: response.data,
        });
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        res.status(500).json({
          message: "An error occurred while prebooking from tpo.",
          error: error,
        });
      }
    };
    return preBooking();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while  prebooking from server.",
      error: error.message,
    });
  }
};
