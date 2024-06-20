import request from "./API_request.js";

async function get_player() {
  let res = await request("player");
  return res.data;
}

export default {
  get_player,
}