const { QUERY } = require("../constants/query");
const { pool } = require("../mariadb");
const { v4 } = require("uuid");

const getUserData = async (req, res) => {
  let conn;
  let rows;
  try {
    const payload = {};
    const { id } = req.userInfo;

    conn = await pool.getConnection();
    rows = await conn.query(QUERY.GET_SHEETS, [id]);
    payload.sheets = rows;

    rows = await conn.query(QUERY.GET_ROUNDS, [id]);
    payload.rounds = rows;

    rows = await conn.query(QUERY.GET_ENDS, [id]);
    payload.ends = rows;
    res.json(payload);
  } catch (err) {
    console.error("Get UserData Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const addProfile = async (req, res) => {
  let conn;
  try {
    const { role, name, teamName } = req.body;
    const { email } = req.userInfo;

    conn = await pool.getConnection();
    await conn.query(QUERY.ADD_PROFILE, [role, name, teamName, email]);
    res.json(req.body);
  } catch (err) {
    console.error("Add Profile Error: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const addSheet = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { name, date, startTime, endTime, place } = req.body;

    const rows = await conn.query(QUERY.ADD_SHEET, [
      id,
      name,
      date,
      startTime,
      endTime,
      place,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error("Add Sheet Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const addRound = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { sheet_id, distance, arrowCount, endCount } = req.body;
    const rows = await conn.query(QUERY.ADD_ROUND, [
      id,
      sheet_id,
      distance,
      arrowCount,
      endCount,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Add Round Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const addEnd = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { round_id, scores } = req.body;
    const rows = await conn.query(QUERY.ADD_END, [
      id,
      round_id,
      JSON.stringify(scores),
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Add Round Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const updateSheet = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { sheet_id, name, date, startTime, endTime, place } = req.body;
    await conn.query(QUERY.UPDATE_SHEET, [
      name,
      date,
      startTime,
      endTime,
      place,
      sheet_id,
      id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error("update Sheet Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const updateRound = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { round_id, distance, arrowCount, endCount } = req.body;
    await conn.query(QUERY.UPDATE_ROUND, [
      distance,
      arrowCount,
      endCount,
      round_id,
      id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error("update Round Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const updateEnd = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { end_id, scores } = req.body;
    await conn.query(QUERY.UPDATE_END, [JSON.stringify(scores), end_id, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("update End Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const updateEnds = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { ends, endCount } = req.body;
    Promise.all(
      ends.map(
        async (end) =>
          await conn.query(QUERY.UPDATE_END, [end.scores, end.id, id])
      )
    );
    if (endCount < ends.length) {
      const deleteTargets = ends.slice(endCount);
      Promise.all(
        deleteTargets.map(
          async (end) => await conn.query(QUERY.DELETE_END, [end.id, id])
        )
      );
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("update End Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const deleteSheet = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { sheet_id } = req.body;
    await conn.query(QUERY.DELETE_SHEET, [sheet_id, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Delete Sheet Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const deleteRound = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { round_id } = req.body;
    await conn.query(QUERY.DELETE_ROUND, [round_id, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Delete Sheet Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getUserData,
  addProfile,
  addSheet,
  addRound,
  addEnd,
  deleteSheet,
  deleteRound,
  updateSheet,
  updateRound,
  updateEnd,
  updateEnds,
};
