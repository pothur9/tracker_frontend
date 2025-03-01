const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Coupon = require("../models/coupon.model");
const Wallet = require("../models/wallet.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Environment variables for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Login

exports.createAdmin = async (req, res) => {
  const { username, email, password, name } = req.body;

  try {
    // Check if an admin with the same email or username already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email/username already exists." });
    }

    // Create a new admin
    const newAdmin = new Admin({
      name,
      username,
      email,
      password,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Send success response
    res.status(201).json({
      message: "Admin user created successfully",
      admin: {
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin user", error });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password, ipAddress, apiSource } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // Save login history
    admin.loginHistory.push({ ipAddress, apiSource });
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get All Customers
exports.getAllCustomers = async (req, res) => {
  const { sortBy, order = "asc", search } = req.query;
  try {
    const query = search
      ? { "profile.name": { $regex: search, $options: "i" } }
      : {};
    const customers = await User.find(query).sort({
      [sortBy]: order === "asc" ? 1 : -1,
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// Get All Bookings
exports.getAllBookings = async (req, res) => {
  const { sortBy, order = "asc", type, status } = req.query;
  try {
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const bookings = await Booking.find(query).sort({
      [sortBy]: order === "asc" ? 1 : -1,
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Create Coupons
exports.createCoupons = async (req, res) => {
  const { title, discount, expiry, forUsers, minPurchase } = req.body;
  try {
    let users;
    if (forUsers === "specific") {
      users = await User.find({ _id: { $in: req.body.userIds } });
    } else if (forUsers === "spenders") {
      users = await User.find({ "wallets.balance": { $gte: minPurchase } });
    } else {
      users = await User.find(); // All users
    }

    const coupon = new Coupon({ title, discount, expiry });
    await coupon.save();

    users.forEach(async (user) => {
      user.coupons.push(coupon._id);
      await user.save();
    });

    res.status(201).json({ message: "Coupon created and assigned", coupon });
  } catch (error) {
    res.status(500).json({ message: "Error creating coupons", error });
  }
};

// Push Cash to Wallet
exports.pushCashToWallet = async (req, res) => {
  const { userId, amount, type } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = new Wallet({ balance: amount, type });
    await wallet.save();

    user.wallets.push(wallet._id);
    await user.save();

    res.status(201).json({ message: "Cash added to wallet", wallet });
  } catch (error) {
    res.status(500).json({ message: "Error adding cash to wallet", error });
  }
};
