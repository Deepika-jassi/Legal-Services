// backend/verificationDb.js
const fs = require("fs");
const path = require("path");
const DB_FILE = path.join(__dirname, "verifications.json");

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8") || "{}");
  } catch {
    return {};
  }
}
function writeDB(data){ fs.writeFileSync(DB_FILE, JSON.stringify(data, null,2)); }

module.exports = {
  get: (id) => { const db = readDB(); return db[id] || null; },
  set: (id, obj) => { const db = readDB(); db[id] = obj; writeDB(db); return db[id]; },
  list: () => readDB(),
};
