const QRCode = require("qrcode");

const url = "https://www.easy2trip.com/redirect/applinks";

QRCode.toFile(
  "easy2trip_qr.png",
  url,
  {
    width: 300,
    errorCorrectionLevel: "H",
  },
  (err) => {
    if (err) {
      console.error("Error generating QR code:", err);
    } else {
      console.log("QR code saved as easy2trip_qr.png");
    }
  }
);
