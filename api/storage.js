import { markdownTable as mdtable } from "markdown-table";
import request from "./API_request.js";
import utils from "../utils.js";
import config from "../config.json" assert { type: "json" };

async function get_storage() {
  let res = await request(`buildings/${config.storage_ID}`);
  return res.data.storage;
}

function create_inventory_table(assets) {
  let table_arr = [
    [
      "name",
      "balance",
      "reserved",
      "capacity",
      "purchase",
      "purchase_price",
      "sale",
      "sale_price",
      "unit_cost",
    ],
  ];
  let asset_names = Object.keys(assets);

  for (let i = 0; i < asset_names.length; i++) {
    let asset = assets[asset_names[i]];
    let row_arr = [
      asset_names[i],
      asset.balance,
      asset.reserved,
      asset.capacity,
      asset.purchase,
      asset.purchase_price,
      asset.sale,
      asset.sale_price,
      asset.unit_cost,
    ];

    row_arr = row_arr.map((item) => {
      if (item === undefined || item === null) {
        return "";
      } else return item;
    });

    table_arr.push(row_arr);
  }

  return mdtable(table_arr);
}

function create_flow_table(flows) {
  let table_arr = [
    [
      "name",
      "comsumption",
      "production",
      "production_cost",
      "expiration",
      "purchase",
      "sale",
      "transfer",
    ],
  ];

  let flow_names = Object.keys(flows);

  for (let i = 0; i < flow_names.length; i++) {
    let flow = flows[flow_names[i]];
    let row_arr = [
      flow_names[i],
      flow.consumption,
      flow.production,
      flow.production_cost,
      flow.expiration,
      flow.purchase,
      flow.sale,
      flow.transfer,
    ];

    row_arr = row_arr.map((item) => {
      if (item === undefined || item === null) {
        return "";
      } else return item;
    });

    table_arr.push(row_arr);
  }

  return mdtable(table_arr);
}

async function get_inventory_table() {
  let storage = await get_storage();
  let assets = storage.inventory.account.assets;

  return create_inventory_table(assets);
}

async function get_flow_table() {
  let storage = await get_storage();
  let flows = storage.inventory.previous_flows;

  return create_flow_table(flows);
}

async function print_inventory_table(assets) {
  utils.logToFile("Inventory\n" + create_inventory_table(assets));
  console.log("Inventory");
  console.table(assets);
}

async function print_flow_table(flows) {
  utils.logToFile("Previous turn flows\n" + create_flow_table(flows));
  console.log("Previous turn flows");
  console.table(flows);
}

async function print_tables() {
  let storage = await get_storage();
  let assets = storage.inventory.account.assets;
  let flows = storage.inventory.previous_flows;

  print_inventory_table(assets);
  print_flow_table(flows);
}

export default {
  get_storage,
  create_inventory_table,
  create_flow_table,
  get_inventory_table,
  get_flow_table,
  print_inventory_table,
  print_flow_table,
  print_tables,
};
