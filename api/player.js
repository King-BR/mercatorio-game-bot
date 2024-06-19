const request = require("./API_request.js");

async function get_player() {
  let res = await request("player");
  return res.data;
}

module.exports = {
  get_player,
}