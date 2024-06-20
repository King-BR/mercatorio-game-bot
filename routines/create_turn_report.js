import { existsSync, mkdirSync, createWriteStream } from "fs";
import utils from "../utils.js";
import API_storage from "../api/storage.js";

export default async function () {
  utils.logger.info("Creating turn report...");

  if (!existsSync("reports")) {
    mkdirSync("reports");
  }

  const logStream = createWriteStream(`reports/turn_report_${utils.getCurrentDateTimeFile()}.md`, {
    flags: "a",
  });

  logStream.write(`# Turn report for ${utils.getCurrentDateTime()}\n`);
  logStream.write(`\n`);

  var storage = await API_storage.get_storage();
  var assets = storage.inventory.account.assets;
  var flows = storage.inventory.previous_flows;

  logStream.write("## Inventory\n");
  logStream.write(API_storage.create_inventory_table(assets));

  logStream.write("\n\n");

  logStream.write("## Previous turn flows\n");
  logStream.write(API_storage.create_flow_table(flows));

  logStream.end();
}