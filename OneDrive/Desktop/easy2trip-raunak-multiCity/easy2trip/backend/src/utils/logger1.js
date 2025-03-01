const { createLogger, transports, format } = require("winston");
const fs = require("fs");
const path = require("path");

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Logger setup
const logger = createLogger({
  level: "info",

  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: path.join(logDir, "api.log") }),
    new transports.Console(), // Log to console for debuggsdading
  ],
});

module.exports = logger;
