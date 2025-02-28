const nodemailer = require("nodemailer");
require("dotenv").config();

const { CURRENT_ENVIRONMENT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_PORT } =
  process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", //CURRENT_ENVIRONMENT == "development" ? "smtp.mailtrap.io" : "",
  port: 465, //SMTP_PORT,
  secure: true, //false,
  auth: {
    user: "dessaimakrand@gmail.com", //SMTP_USERNAME,
    pass: "okajnppwwzwrdhcm", //SMTP_PASSWORD,
  },
});

module.exports = transporter;
