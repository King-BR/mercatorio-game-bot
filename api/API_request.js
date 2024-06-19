const axios = require("axios");
const config = require("../config.json");

module.exports = async function (endpoint) {
  return axios
    .get(`${config.base_url}${endpoint}`, {
      headers: {
        "X-Merc-User": process.env.USER,
        Authorization: process.env.AUTH,
      },
    })
}