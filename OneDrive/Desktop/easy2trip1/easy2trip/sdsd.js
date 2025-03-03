const Hotel = require("../models/hotels.model");
const axios = require("axios");

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

// Start the process
// Replace 'IN' with the desired country code

exports.searchHotelsFromApi = async (req, res) => {
  const {} = req.body;

  try {
    if (!location || !checkIn || !checkOut || !rooms || !guests) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    let query = {
      location: new RegExp(location, "i"), // Case-insensitive match for location
      pricePerNight: { $lte: pricePerNight },
      roomsAvailable: { $gte: rooms },
    };

    const hotels = await Hotel.find(query);

    if (!hotels.length) {
      return res
        .status(404)
        .json({ message: "No hotels found for the given criteria." });
    }

    const formattedHotels = hotels.map((hotel) => ({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: `₹ ${hotel.pricePerNight}`,
      amenities: hotel.amenities,
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      roomsAvailable: hotel.roomsAvailable,
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
  const { location, checkIn, checkOut, rooms, guests, pricePerNight } =
    req.body;

  try {
    if (!location || !checkIn || !checkOut || !rooms || !guests) {
      return res.status(400).json({
        message: "Invalid input. Please provide all required fields.",
      });
    }

    let query = {
      location: new RegExp(location, "i"), // Case-insensitive match for location
      pricePerNight: { $lte: pricePerNight },
      roomsAvailable: { $gte: rooms },
    };

    const hotels = await Hotel.find(query);

    if (!hotels.length) {
      return res
        .status(404)
        .json({ message: "No hotels found for the given criteria." });
    }

    const formattedHotels = hotels.map((hotel) => ({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: `₹ ${hotel.pricePerNight}`,
      amenities: hotel.amenities,
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      roomsAvailable: hotel.roomsAvailable,
    }));

    res.json(formattedHotels);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for hotels." });
  }
};
