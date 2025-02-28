const crypto = require("crypto"); // For generating OTPs
const User = require("../models/user.model"); // Import your User model
const { encrypt, decrypt } = require("../utils/encryptdecrypt");
const bcrypt = require("bcryptjs"); // For hashing password
const qs = require("qs");
const axios = require("axios");

exports.sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    // Encrypt the phone number before saving or looking it up
    const encryptedPhone = phoneToAlphabet(phoneNumber);
    console.log("encryptedPhone", encryptedPhone);

    // Check if the user is already registered with the provided phone number
    let user = await User.findOne({ phoneNumber: encryptedPhone });
    console.log(" user", user);

    // If the user does not exist, create a new user
    if (!user) {
      user = new User({ phoneNumber: encryptedPhone, isVerified: false });
      await user.save(); // Save the user to the database
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Random 6-digit OTP
    user.otp = crypto.createHash("sha256").update(otp).digest("hex"); // Hash OTP before saving for security
    await user.save();

    // Send OTP via an external service (e.g., Twilio)
    let data = qs.stringify({
      To: phoneNumber,
      Channel: "sms",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://verify.twilio.com/v2/Services/VAe4444d8de9612f380472302a6137bb91/Verifications", // Replace with actual URL
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic QUM0MDI5ZDU2MDcyYjU5ODUzOGE0YjMzZjNkMDYwMzY1Nzo2M2I4MjExYTg1NWZiNjZlMzAwMTFiNzcwY2MyNGU3Mw==", // Twilio Auth Key
      },
      data: data,
    };

    // Make the request to Twilio API to send the OTP
    await axios
      .request(config)
      .then((response) => {
        console.log("OTP sent successfully: ", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log("Error sending OTP: ", error);
      });

    // Respond to the client based on whether the user is verified or not
    res.json({
      message: user.isVerified
        ? "OTP sent for login." // If already verified, send for login
        : "OTP sent for account creation.", // If not verified, send for registration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};
exports.validateOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required." });
  }

  try {
    const encryptedPhone = phoneToAlphabet(phoneNumber);
    const user = await User.findOne({ phoneNumber: encryptedPhone });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up." });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    let data = qs.stringify({
      To: phoneNumber,
      Code: otp,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://verify.twilio.com/v2/Services/VAe4444d8de9612f380472302a6137bb91/VerificationCheck",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic QUM0MDI5ZDU2MDcyYjU5ODUzOGE0YjMzZjNkMDYwMzY1Nzo2M2I4MjExYTg1NWZiNjZlMzAwMTFiNzcwY2MyNGU3Mw==",
      },
      data: data,
    };

    let responseOtp = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    if (responseOtp.status == "approved") {
      //(user.otp === hashedOtp)
      user.isVerified = true;
      user.otp = null; // Clear OTP
      await user.save();

      const profile = {
        name: user.profile.name ? decrypt(user.profile.name) : null,
        birthday: user.profile.birthday ? decrypt(user.profile.birthday) : null,
        email: user.loginDetails.email
          ? decrypt(user.loginDetails.email)
          : null,
        ...user.profile,
      };

      res.json({
        message: user.profile.name
          ? "Login successful."
          : "Account created successfully. Please complete your profile.",
        profile,
      });
    } else {
      res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to validate OTP." });
  }
};

exports.updateUser = async (req, res) => {
  const { phoneNumber, email, password, profile, coTravellers } = req.body;

  try {
    // Find the user by phone number (encrypted)
    const user = await User.findOne({
      phoneNumber: phoneToAlphabet(phoneNumber),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided in the request body
    const updates = {};

    if (email) {
      updates["loginDetails.email"] = encrypt(email); // Encrypt email before saving
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates["loginDetails.password"] = hashedPassword; // Hash password before saving
    }

    // Update profile fields if provided
    if (profile) {
      if (profile.name !== undefined)
        updates["profile.name"] = encrypt(profile.name);
      if (profile.birthday !== undefined)
        updates["profile.birthday"] = encrypt(profile.birthday);
      if (profile.gender !== undefined)
        updates["profile.gender"] = profile.gender;
      if (profile.maritalStatus !== undefined)
        updates["profile.maritalStatus"] = profile.maritalStatus;
      if (profile.address !== undefined)
        updates["profile.address"] = encrypt(profile.address);
      if (profile.pincode !== undefined)
        updates["profile.pincode"] = profile.pincode;
      if (profile.state !== undefined) updates["profile.state"] = profile.state;
    }

    // Update co-travellers if provided
    if (coTravellers && coTravellers.length > 0) {
      updates["coTravellers"] = coTravellers.map((traveller) => {
        const updatedTraveller = {};
        if (traveller.title !== undefined)
          updatedTraveller.title = traveller.title;
        if (traveller.name !== undefined)
          updatedTraveller.name = encrypt(traveller.name); // Encrypt name
        if (traveller.gender !== undefined)
          updatedTraveller.gender = traveller.gender;
        if (traveller.age !== undefined) updatedTraveller.age = traveller.age;
        if (traveller.dob !== undefined)
          updatedTraveller.dob = encrypt(traveller.dob); // Encrypt DOB
        return updatedTraveller;
      });
    }

    // Apply updates
    await User.updateOne(
      { phoneNumber: phoneToAlphabet(phoneNumber) },
      { $set: updates }
    );

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile." });
  }
};

exports.phoneToAlphabet = (phoneNumber) => {
  const phoneMap = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
    7: "H",
    8: "I",
    9: "J",
  };

  return phoneNumber
    .split("")
    .map((digit) => phoneMap[digit])
    .join("");
};
exports.alphabetToPhone = (alphabeticPhone) => {
  const alphabetMap = {
    A: "0",
    B: "1",
    C: "2",
    D: "3",
    E: "4",
    F: "5",
    G: "6",
    H: "7",
    I: "8",
    J: "9",
  };

  return alphabeticPhone
    .split("")
    .map((char) => alphabetMap[char])
    .join("");
};
