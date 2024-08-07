const M = require("mariadb");
const pool = M.createPool({
  host: "mariadb",
  user: "root",
  password: "test",
  connectionLimit: 10,
});
(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("connection: ", conn);
  } catch (err) {
  } finally {
    if (conn) conn.release();
  }
})();
const execQuery = () => {};

module.exports = {
  pool,
};
