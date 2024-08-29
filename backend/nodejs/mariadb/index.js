const M = require("mariadb");
const path = require("path");
const { readFileSync } = require("fs");

const initFilePath = path.join(__dirname + "/init/create_tables.sql");

const pool = M.createPool({
  host: "mariadb",
  user: "root",
  database: "archery",
  password: "test",
  connectionLimit: 10,
});

(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const file = readFileSync(initFilePath, { encoding: "utf8" });
    const queries = file.split(";").filter((e) => e.trim().length > 0);
    if (queries.length === 0) return;
    queries.forEach(async (query) => {
      console.log("exec query ===========> \n", query.trim());
      await conn.query(query.trim());
    });
  } catch (err) {
  } finally {
    if (conn) conn.release();
  }
})();

module.exports = {
  pool,
};
