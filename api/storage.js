const { table, getBorderCharacters } = require("table");
const request = require("./API_request.js");
const { logger, logToFile } = require("../utils.js");

async function get_storage(config) {
  let res = await request(`buildings/${config.storage_ID}`);
  return res.data;
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

  return table(table_arr, {
    border: getBorderCharacters("ramac"),
    header: { content: "Inventory" },
  });
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

  return table(table_arr, {
    border: getBorderCharacters("ramac"),
    header: { content: "Flows" },
  });
}

async function get_inventory_table(config) {
  let storage = await get_storage(config);
  let assets = storage.storage.inventory.account.assets;

  return create_inventory_table(assets);
}

async function get_flow_table(config) {
  let storage = await get_storage(config);
  let flows = storage.storage.inventory.previous_flows;

  return create_flow_table(flows);
}

async function print_inventory_table(assets) {
  logToFile(create_inventory_table(assets));
  console.log("Inventory");
  console.table(assets);
}

async function print_flow_table(flows) {
  logToFile(create_flow_table(flows));
  console.log("Flows");
  console.table(flows);
}

async function print_tables(config) {
  let storage = await get_storage(config);
  let assets = storage.storage.inventory.account.assets;
  let flows = storage.storage.inventory.previous_flows;

  print_inventory_table(assets);
  print_flow_table(flows);
}

module.exports = {
  get_storage,
  create_inventory_table,
  create_flow_table,
  get_inventory_table,
  get_flow_table,
  print_inventory_table,
  print_flow_table,
  print_tables,
};
