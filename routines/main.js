import API_storage from "../api/storage.js";
import utils from "../utils.js";
import create_turn_report from "./create_turn_report.js";

export default async function () {
  utils.logger.info(`${utils.getCurrentDateTime()} | Executing main routine...`);

  await API_storage.print_tables();


  await create_turn_report();
  utils.logger.info(`Main routine ended. Waiting next turn...`);
}