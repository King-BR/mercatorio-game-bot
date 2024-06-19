const fs = require("fs");
const { logger } = require("../utils.js");
const config = require("../config.json");

module.exports = async function () {
  logger.info("Creating turn report...");

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  
}