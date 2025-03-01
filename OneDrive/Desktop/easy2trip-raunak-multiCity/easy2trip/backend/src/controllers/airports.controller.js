const Airport = require("../models/airports.model");

// Fetch all airports
const getAllAirports = async (req, res) => {
  try {
    const airports = await Airport.find();
    res.json(airports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch airports" });
  }
};

// Search airports by city name
const searchAirports = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    const airports = await Airport.aggregate([
      {
        $addFields: {
          // Set priority based on matches: 1 for CITYNAME, 2 for AIRPORTCODE, 3 for no match
          priority: {
            $cond: [
              {
                $regexMatch: {
                  input: "$CITYNAME",
                  regex: keyword,
                  options: "i",
                },
              },
              1,
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$AIRPORTCODE",
                      regex: keyword,
                      options: "i",
                    },
                  },
                  2,
                  3,
                ],
              },
            ],
          },
        },
      },
      // Only keep documents that have a match on either field (priority 1 or 2)
      { $match: { priority: { $lt: 3 } } },
      // Sort so that documents with CITYNAME match (priority 1) come first
      { $sort: { priority: 1 } },
    ]);

    res.json(airports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search airports" });
  }
};

module.exports = {
  getAllAirports,
  searchAirports,
};
