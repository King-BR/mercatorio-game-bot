const fs = require("fs");
const { logger, getCurrentDateTimeFile, getCurrentDateTime } = require("../utils.js");
const config = require("../config.json");
const { get_storage, create_inventory_table, create_flow_table } = require("../api/storage.js");

module.exports = async function () {
  logger.info("Creating turn report...");

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  const logStream = fs.createWriteStream(`reports/turn_report_${getCurrentDateTimeFile()}.txt`, {
    flags: "a",
  });

  logStream.write(`Turn report for ${getCurrentDateTime()}\n`);
  logStream.write(`\n`);

  var storage = await get_storage(config);
  var assets = storage.storage.inventory.account.assets;
  var flows = storage.storage.inventory.previous_flows;

  logStream.write(create_inventory_table(assets));
  logStream.write(create_flow_table(flows));

  logStream.end();
}