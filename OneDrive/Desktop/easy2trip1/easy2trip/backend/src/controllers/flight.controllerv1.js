// const Flight = require("../models/flight.model");
const axios = require("axios");
const Booking = require("../models/booking.model");
const Tokens = require("../models/tokens.model");
const _ = require("lodash");
const addBooking = require("./bookings.controller");
const logger = require("../utils/logger1");

exports.searchFlights = async (req, res) => {
  console.log("inside searchFlights");
  const tokenData = await Tokens.findOne();
  console.log(req.body);
  const {
    adultCount,
    childCount,
    infantCount,
    directFlight,
    oneStopFlight,
    journeyType,
    preferredAirlines,
    segments,
    sources,
    flightCabinClass,
  } = req.body;

  try {
    console.log("searchFlights: ", req.body);
    let data = JSON.stringify({
      EndUserIp: process.env.END_USER_IP,
      TokenId: tokenData.tokenId,
      AdultCount: adultCount.toString(),
      ChildCount: childCount.toString(),
      InfantCount: infantCount.toString(),
      DirectFlight: directFlight,
      OneStopFlight: oneStopFlight,
      JourneyType: journeyType.toString(),
      PreferredAirlines: preferredAirlines,
      Segments: segments,
      Sources: sources,
      FlightCabinClass: flightCabinClass,
    });

    logger.info({
      message: "API Request Search Flights",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      timeout: 180000,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      data: data,
    };

    let internalFlightSearch = await axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        logger.info({
          message: "API Response Search Flight",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
          status: response.status,
          responseBody: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    res.json(internalFlightSearch);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for flights." });
  }
};

// Utility function to calculate total seats required

// {
//     "type": "one-way",
//     "fromCity": "New Delhi",
//     "toCity": "Bengaluru",
//     "departureDate": "2025-01-20",
//     "travellers": { "ADULTS": 2, "CHILDREN": 1, "INFANTS": 0 },
//     "classType": "Economy",
//     "sortBy": "PRICE",
//     "filters": {
//         "airline": ["IndiGo", "Air India"],
//         "stops": 0,
//         "price": { "min": 5000, "max": 15000 },
//         "departureTimeRange": {
//             "start": "2025-01-20T00:00:00Z",
//             "end": "2025-01-20T12:00:00Z"
//         }
//     }
// }

exports.fareRule = async (req, res) => {
  const { traceId, resultIndex } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    let data = JSON.stringify({
      EndUserIp: process.env.END_USER_IP,
      TokenId: tokenData.tokenId,
      TraceId: traceId,
      ResultIndex: resultIndex,
    });
    logger.info({
      message: "API Request Fare Rule",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const fareRule = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        logger.info({
          message: "API Response Fare Rule",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule",
          status: response.status,
          responseBody: response.data,
        });

        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    res.json(fareRule);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};

exports.fareQuote = async (req, res) => {
  const { traceId, resultIndex } = req.body;
  const tokenData = await Tokens.findOne();
  try {
    let data = JSON.stringify({
      EndUserIp: process.env.END_USER_IP,
      TokenId: tokenData.tokenId,
      TraceId: traceId,
      ResultIndex: resultIndex,
    });
    logger.info({
      message: "API Response Fare Quote",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote",

      data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const fareQuoteResponse = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        logger.info({
          message: "API Response Fare Quote",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote",

          status: response.status,
          responseBody: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    res.json(fareQuoteResponse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};

exports.ticketFlight = async (req, res) => {
  const { traceId, resultIndex, passengers, paymentDetails } = req.body;
  const tokenData = await Tokens.findOne();
  try {
    let data = JSON.stringify({
      PreferredCurrency: null,
      Passengers: passengers,
      EndUserIp: "192.168.5.56",
      TokenId: tokenData.tokenId,
      TraceId: traceId,
      ResultIndex: resultIndex,
    });
    logger.info({
      message: "API Response Ticket",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",

      data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const flightApiResponse = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        logger.info({
          message: "API Response Ticket",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",

          status: response.status,
          responseBody: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    const normalizedResponse = normalizeKeysToCamelCase(
      flightApiResponse["Response"]["Response"]
    );

    const bookingData = {
      type: "flight", // 'hotel' for hotel bookings
      status: "confirmed",
      flightDetails: normalizedResponse,
      paymentDetails: paymentDetails ?? {
        amount:
          flightApiResponse["Response"]["Response"]["FlightItinerary"]["Fare"][
            "PublishedFare"
          ],
        currency: "INR",
      },
    };
    const newBooking = new Booking(bookingData);
    const result = await newBooking.save();
    const leadPassengerDetails = {};

    passengers.forEach((passenger) => {
      if (passenger.IsLeadPax) {
        // Add country code to contact number
        let contactNumber = passenger.ContactNo;
        if (passenger.CountryCode === "IN") {
          contactNumber = `+91${contactNumber}`;
        }

        // Capture name and email
        leadPassengerDetails.name = `${passenger.FirstName} ${passenger.LastName}`;
        leadPassengerDetails.contactNumber = contactNumber;
        leadPassengerDetails.email = passenger.Email;
      }
    });

    // addBooking(leadPassengerDetails, result._id);

    res.json(flightApiResponse);
    return result;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};

exports.ticketFlightNonLcc = async (req, res) => {
  const { traceId, bookingId, pnr } = req.body;
  const tokenData = await Tokens.findOne();
  try {
    let data = JSON.stringify({
      PNR: pnr,
      BookingId: bookingId,
      TokenId: tokenData.tokenId,
      TraceId: traceId,
      EndUserIp: "192.168.11.58",
    });
    logger.info({
      message: "API Response Ticket",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",

      data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const flightApiResponse = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        logger.info({
          message: "API Response Ticket",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",

          status: response.status,
          responseBody: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    res.json(flightApiResponse);
    // const normalizedResponse = normalizeKeysToCamelCase(
    //   flightApiResponse["Response"]["Response"]
    // );

    // const bookingData = {
    //   type: "flight", // 'hotel' for hotel bookings
    //   status: "confirmed",
    //   flightDetails: normalizedResponse,
    //   paymentDetails: paymentDetails ?? {
    //     amount:
    //       flightApiResponse["Response"]["Response"]["FlightItinerary"]["Fare"][
    //         "PublishedFare"
    //       ],
    //     currency: "INR",
    //   },
    // };
    // const newBooking = new Booking(bookingData);
    // const result = await newBooking.save();
    // const leadPassengerDetails = {};

    // passengers.forEach((passenger) => {
    //   if (passenger.IsLeadPax) {
    //     // Add country code to contact number
    //     let contactNumber = passenger.ContactNo;
    //     if (passenger.CountryCode === "IN") {
    //       contactNumber = `+91${contactNumber}`;
    //     }

    //     // Capture name and email
    //     leadPassengerDetails.name = `${passenger.FirstName} ${passenger.LastName}`;
    //     leadPassengerDetails.contactNumber = contactNumber;
    //     leadPassengerDetails.email = passenger.Email;
    //   }
    // });

    // // addBooking(leadPassengerDetails, result._id);

    // res.json(flightApiResponse);
    // return result;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};

exports.getSSR = async (req, res) => {
  const { traceId, resultIndex } = req.body;
  const tokenData = await Tokens.findOne();
  try {
    let data = JSON.stringify({
      EndUserIp: process.env.END_USER_IP,
      TokenId: tokenData.tokenId,
      TraceId: traceId,
      ResultIndex: resultIndex,
    });

    logger.info({
      message: "API Response SSR",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/getSSR",

      data,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const ssrResponse = await axios
      .request(config)
      .then((response) => {
        logger.info({
          message: "API Response SSR",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR",

          status: response.status,
          responseBody: response.data,
        });
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    res.json(ssrResponse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};

exports.bookFlight = async (req, res) => {
  const { resultIndex, traceId, passengers } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    let data = JSON.stringify({
      ResultIndex: resultIndex,
      Passengers: passengers,
      EndUserIp: process.env.END_USER_IP,
      TokenId: tokenData.tokenId,
      TraceId: traceId,
    });
    logger.info({
      message: "API Response Book",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book",

      data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const bookingResponse = await axios
      .request(config)
      .then((response) => {
        logger.info({
          message: "API Response Book",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book",

          status: response.status,
          responseBody: response.data,
        });
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ message: "An error occurred while booking the flight." });
      });
    res.json(bookingResponse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};

exports.ticketFlightSample = async (req, res) => {
  const { Response, paymentDetails, passengers } = req.body;
  const tokenData = await Tokens.findOne();
  try {
    const normalizedResponse = normalizeKeysToCamelCase(Response["Response"]);

    const bookingData = {
      type: "flight", // 'hotel' for hotel bookings
      status: "confirmed",
      flightDetails: normalizedResponse,
      paymentDetails,
    };
    const newBooking = new Booking(bookingData);
    const result = await newBooking.save();
    const leadPassengerDetails = {};

    passengers.forEach((passenger) => {
      if (passenger.IsLeadPax) {
        // Add country code to contact number
        let contactNumber = passenger.ContactNo;
        if (passenger.CountryCode === "IN") {
          contactNumber = `+91${contactNumber}`;
        }

        // Capture name and email
        leadPassengerDetails.name = `${passenger.FirstName} ${passenger.LastName}`;
        leadPassengerDetails.contactNumber = contactNumber;
        leadPassengerDetails.email = passenger.Email;
      }
    });

    // addBooking(leadPassengerDetails, result._id);

    res.json(Response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};

// Controller to handle fetching available seats for a flight

exports.getFlightBokkingsdetails = async (req, res) => {
  const { resultIndex, traceId, passengers } = req.body;
  const tokenData = await Tokens.findOne();

  try {
    let data = JSON.stringify({
      EndUserIp: "192.168.11.58",
      TokenId: tokenData.tokenId,
      TraceId: traceId,
    });
    logger.info({
      message: "API Response Book",
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails",

      data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const bookingResponse = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        logger.info({
          message: "API Response GetBookingDetail s",
          url: "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails",

          status: response.status,
          responseBody: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ message: "An error occurred while booking the flight." });
      });
    res.json(bookingResponse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the flight." });
  }
};
const normalizeKeysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeKeysToCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[_.camelCase(key)] = normalizeKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj; // Return the value if it's not an array or object
};
