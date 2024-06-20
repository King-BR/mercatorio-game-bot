import axios from "axios";
import config from "../config.json" assert { type: "json" };

export default async function (endpoint) {
  return axios.get(`${config.base_url}${endpoint}`, {
      headers: {
        "X-Merc-User": process.env.USER,
        Authorization: process.env.AUTH,
      },
    })
}