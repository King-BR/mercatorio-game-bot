const fs = require("fs");

function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function getFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

function logToFile(message) {
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
  }

  const logStream = fs.createWriteStream(`logs/log_${getFormattedDate()}.txt`, {
    flags: "a",
  });

  logStream.write(`${message}\n`);
  logStream.end();
}

const logger = {
  info: (message) => {
    logToFile(message);
    console.log(message);
  },
  warn: (message) => {
    logToFile(`[WARN] ${message}`);
    console.warn(message);
  },
  error: (message) => {
    logToFile(`[ERROR] ${message}`);
    console.error(message);
  },
};

module.exports = {
  getCurrentDateTime,
  logToFile,
  logger,
};
