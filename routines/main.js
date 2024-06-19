const { print_tables } = require("../api/storage");
const { getCurrentDateTime, logger } = require("../utils.js");
const create_turn_report = require("./create_turn_report.js");

module.exports = async function () {
  logger.info(`${getCurrentDateTime()} | Executing main routine...`);

  await print_tables();


  await create_turn_report();
  logger.info(`Main routine ended. Waiting next turn...`);
}