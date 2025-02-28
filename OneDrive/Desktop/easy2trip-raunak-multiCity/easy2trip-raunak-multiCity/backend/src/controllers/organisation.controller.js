const Organisation = require("../models/organisation.model");
const Booking = require("../models/booking.model");

exports.addDomain = async (req, res) => {
  const { name, domain, spendingLimit, paymentInterval, paymentDueDate } =
    req.body;

  // Validate required fields
  if (
    !name ||
    !domain ||
    !spendingLimit ||
    !paymentInterval ||
    !paymentDueDate
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if domain already exists
    const existingDomain = await Organisation.findOne({ domain });
    if (existingDomain) {
      return res.status(400).json({ message: "Domain already exists." });
    }

    // Create a new organisation with the provided details
    const newDomain = new Organisation({
      name,
      domain,
      spendingLimit,
      paymentInterval,
      paymentDueDate,
    });

    // Save the new organisation
    await newDomain.save();

    // Return success response
    res
      .status(201)
      .json({ message: "Domain added successfully.", domain: newDomain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding domain." });
  }
};

exports.getDomains = async (req, res) => {
  try {
    const domains = await Organisation.find();
    res.status(200).json(domains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving domains." });
  }
};

exports.deleteDomain = async (req, res) => {
  const { domain } = req.body;

  try {
    const deletedDomain = await Organisation.findOneAndDelete({ domain });
    if (!deletedDomain) {
      return res.status(404).json({ message: "Domain not found." });
    }

    res.status(200).json({ message: "Domain deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting domain." });
  }
};

exports.generateInvoices = async (req, res) => {
  try {
    const organisations = await Organisation.find({ isActive: true }).populate(
      "bookings"
    );

    organisations.forEach(async (organisation) => {
      const today = new Date();
      const interval = organisation.paymentInterval;

      // Calculate the start and end dates for the invoice period
      const endDate = new Date(
        today.setDate(today.getDate() - (today.getDate() % interval))
      );
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - interval);

      // Filter bookings within the date range
      const bookings = organisation.bookings.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= startDate && bookingDate < endDate;
      });

      if (bookings.length > 0) {
        // Calculate the total invoice amount
        const totalAmount = bookings.reduce(
          (acc, booking) => acc + booking.paymentDetails.amount,
          0
        );

        // Add a new invoice
        organisation.invoices.push({
          invoiceDate: new Date(),
          startDate,
          endDate,
          amount: totalAmount,
          bookings: bookings.map((b) => b._id),
        });

        await organisation.save();

        // Send invoice via email
        // (Assuming a sendEmail utility exists)
        sendEmail({
          to: organisation.domain,
          subject: `Invoice for ${organisation.name}`,
          text: `Your invoice of $${totalAmount} from ${startDate.toISOString()} to ${endDate.toISOString()} has been generated. Please pay before the due date.`,
        });
      }
    });

    res.status(200).json({ message: "Invoices generated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error generating invoices", error });
  }
};

exports.getInvoices = async (req, res) => {
  const { organisationId } = req.params;

  try {
    const organisation = await Organisation.findById(organisationId).populate(
      "invoices.bookings"
    );
    if (!organisation)
      return res.status(404).json({ message: "Organisation not found" });

    res.status(200).json({ invoices: organisation.invoices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

exports.pauseOrganisation = async (req, res) => {
  const { organisationId } = req.body;

  try {
    const organisation = await Organisation.findById(organisationId);
    if (!organisation)
      return res.status(404).json({ message: "Organisation not found" });

    const unpaidInvoices = organisation.invoices.filter(
      (invoice) => invoice.status === "unpaid"
    );

    if (unpaidInvoices.length > 0) {
      organisation.isActive = false;
      await organisation.save();

      res.status(200).json({
        message: "Organisation subscription paused due to unpaid invoices",
      });
    } else {
      res
        .status(400)
        .json({ message: "No unpaid invoices. Subscription remains active." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error pausing subscription", error });
  }
};

exports.createOrganisationBooking = async (req, res) => {
  const { organisationId, bookingDetails } = req.body;

  try {
    const organisation = await Organisation.findById(organisationId).populate(
      "bookings"
    );
    if (!organisation)
      return res.status(404).json({ message: "Organisation not found" });

    // Calculate total spending
    const totalSpent = organisation.bookings.reduce(
      (acc, booking) => acc + booking.paymentDetails.amount,
      0
    );

    // Check spending limit
    if (
      totalSpent + bookingDetails.paymentDetails.amount >
      organisation.spendingLimit
    ) {
      return res.status(400).json({ message: "Spending limit exceeded" });
    }

    // Create booking
    const booking = new Booking(bookingDetails);
    await booking.save();

    // Add booking to organisation
    organisation.bookings.push(booking._id);
    await organisation.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

exports.createOrganisation = async (req, res) => {
  const { name, domain, spendingLimit, paymentDueDate } = req.body;
  try {
    const organisation = new Organisation({
      name,
      domain,
      spendingLimit,
      paymentDueDate,
    });
    await organisation.save();
    res
      .status(201)
      .json({ message: "Organisation created successfully", organisation });
  } catch (error) {
    res.status(500).json({ message: "Error creating organisation", error });
  }
};
