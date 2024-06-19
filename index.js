require("dotenv").config();

const main_routine = require("./routines/main.js");

// execute main routine once and then execute it every 1 hour
setImmediate(main_routine);
setInterval(main_routine, 1000 * 60 * 60);