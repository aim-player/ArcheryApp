const express = require("express");
const { pool } = require("./mariadb");

const app = express();

app.get("/", (req, res) => res.send("Archery Server is healthy"));
app.get("/db", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("show databases", []);
  res.send(JSON.stringify(rows));
  if (conn) conn.release();
});
app.listen(80, () => {
  console.log("======== Nodejs Server Started");
});
