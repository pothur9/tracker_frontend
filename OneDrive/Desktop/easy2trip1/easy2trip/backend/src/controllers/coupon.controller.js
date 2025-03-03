const Coupon = require("../models/coupon.model");

// Fetch available coupons
exports.getCoupons = async (req, res) => {
  const { airline, minBookingAmount } = req.query;

  try {
    const query = {
      expiryDate: { $gte: new Date() }, // Only valid coupons
    };

    if (airline) {
      query.applicableAirlines = { $in: [airline] };
    }

    if (minBookingAmount) {
      query.minBookingAmount = { $lte: minBookingAmount };
    }

    const coupons = await Coupon.find(query);

    if (!coupons.length) {
      return res.status(404).json({ message: "No coupons found." });
    }

    res.json(
      coupons.map((coupon) => ({
        code: coupon.code,
        description: coupon.description,
        discountPercentage: coupon.discountPercentage,
        maxDiscount: coupon.maxDiscount,
        minBookingAmount: coupon.minBookingAmount,
        expiryDate: coupon.expiryDate,
        termsAndConditions: coupon.termsAndConditions,
      }))
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching coupons." });
  }
};
