const axios = require("axios");
const Tokens = require("../models/tokens.model"); // For API call to create a token

exports.checkAndUpdateToken = async () => {
  const tokenData = await Tokens.findOne(); // Fetch the existing token

  // if (tokenData && new Date() < new Date(tokenData.expiresAt)) {
  //   console.log("Token is valid");
  //   return tokenData.tokenId;
  // }

  console.log("Token is expired or not found. Generating a new token...");

  try {
    let data = JSON.stringify({
      ClientId: "ApiIntegrationNew",
      UserName: process.env.USER_NAME,
      Password: process.env.PASSWORD,
      EndUserIp: process.env.END_USER_IP,
    });

    console.log("data", data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://sharedapi.tektravels.com/SharedData.svc/rest/Authenticate",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response;
      })
      .catch((error) => {
        // console.log(error);
      });
    const newTokenId = response.data.TokenId;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    if (tokenData) {
      // Update the existing token
      tokenData.tokenId = newTokenId;
      tokenData.expiresAt = expiresAt;
      tokenData.logs.push({
        action: "Token Regenerated",
        details: "Token was expired and regenerated using API.",
      });
      await tokenData.save();
    } else {
      // Create a new token entry
      const newToken = new Tokens({
        tokenId: newTokenId,
        createdBy: "System",
        expiresAt,
        logs: [
          {
            action: "Token Created",
            details: "New token generated and saved to database.",
          },
        ],
      });
      await newToken.save();
    }

    console.log("New token generated and saved.");
    return newTokenId;
  } catch (error) {
    console.error("Error generating new token:", error);
    throw new Error("Token generation failed.");
  }
};
