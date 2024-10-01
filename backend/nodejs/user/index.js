const { QUERY } = require("../constants/query");
const { pool } = require("../mariadb");
const { v4 } = require("uuid");

const convertScore = (score) => {
  if (score === "M") return 0;
  if (score === "X") return 10;
  return score;
};
const updateTrainStats = async ({ conn, user_id, train_id }) => {
  const rows = await conn.query(QUERY.GET_ENDS, [user_id, train_id]);
  if (rows.length > 0) {
    let total_score = 0;
    let total_shot = 0;

    rows.forEach((end) => {
      if (end.scores) {
        const scores = JSON.parse(end.scores).filter((score) => !!score);
        total_score += scores.reduce((a, b) => a + convertScore(b), 0);
        total_shot += scores.length;
      }
    });
    await conn.query(QUERY.UPDATE_TRAIN_STATS, [
      total_score,
      total_shot,
      train_id,
      user_id,
    ]);
  }
};
const getUserProfile = async (req, res) => {
  let conn;
  try {
    const { id, role, platform, email } = req.userInfo;
    conn = await pool.getConnection();
    const payload = {};
    const row = await conn.query(QUERY.GET_USER, [platform, email]);
    payload.user = row[0];
    if (role === 1) {
      const row = await conn.query(QUERY.GET_PLAYER_PROFILE, [id]);
      payload.player_profile = row[0];
    }
    res.json(payload);
  } catch (err) {
    console.error("Get UserProfile Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const upateUserName = async (req, res) => {
  let conn;
  try {
    const { id } = req.userInfo;
    const { name } = req.body;
    conn = await pool.getConnection();
    await conn.query(QUERY.UPDATE_USER_NAME, [name, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Update UserName Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const getUserData = async (req, res) => {
  let conn;
  let rows;
  try {
    const payload = {};
    const { id } = req.userInfo;

    conn = await pool.getConnection();
    rows = await conn.query(QUERY.GET_SHEETS, [id]);
    payload.sheets = rows;

    rows = await conn.query(QUERY.GET_TRAINS, [id]);
    payload.trains = rows;

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
const getPlaces = async (req, res) => {
  let conn;
  try {
    const { id } = req.userInfo;
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_PLACES, [id]);
    res.json({ places: rows });
  } catch (err) {
    console.error("Get Places Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const getTrain = async (req, res) => {
  let conn;
  try {
    const { id } = req.userInfo;
    const { train_id } = req.query;
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_TRAIN, [id, train_id]);
    res.json({ train: rows[0] });
  } catch (err) {
    console.error("Get Train Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const getTrains = async (req, res) => {
  let conn;
  try {
    const { id } = req.userInfo;
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_TRAINS, [id]);
    res.json({ trains: rows });
  } catch (err) {
    console.error("Get Trains Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const getEnds = async (req, res) => {
  let conn;
  try {
    const { id } = req.userInfo;
    const { train_id } = req.query;
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_ENDS, [id, train_id]);
    res.json({ ends: rows });
  } catch (err) {
    console.error("Get Ends Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const addProfile = async (req, res) => {
  let conn;
  try {
    const { role, name } = req.body;
    const { id, email } = req.userInfo;

    conn = await pool.getConnection();
    await conn.query(QUERY.ADD_PROFILE, [role, name, email]);
    if (role === 1) await conn.query(QUERY.ADD_PLAYER_PROFILE, [id]);
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
const addTrain = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { distance, arrowCount, endCount, place } = req.body;
    const rows = await conn.query(QUERY.ADD_TRAIN, [
      id,
      distance,
      arrowCount,
      endCount,
      place,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Add Train Error: ", err);
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
    const { train_id, scores } = req.body;
    const rows = await conn.query(QUERY.ADD_END, [
      id,
      train_id,
      JSON.stringify(scores),
    ]);
    await updateTrainStats({ conn, user_id: id, train_id });
    res.json(rows[0]);
  } catch (err) {
    console.error("Add End Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const addPlace = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { name } = req.body;
    const rows = await conn.query(QUERY.ADD_PLACE, [id, name]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Add Place Error: ", err);
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
const updateTrain = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { train_id, distance, arrowCount, endCount } = req.body;
    await conn.query(QUERY.UPDATE_TRAIN, [
      distance,
      arrowCount,
      endCount,
      train_id,
      id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error("update Train Error: ", err);
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
    const { train_id, end_id, scores } = req.body;
    await conn.query(QUERY.UPDATE_END, [JSON.stringify(scores), end_id, id]);
    res.sendStatus(200);
    await updateTrainStats({ conn, user_id: id, train_id });
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

const deleteTrain = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { train_id } = req.body;
    await conn.query(QUERY.DELETE_TRAIN, [train_id, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Delete Sheet Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const deletePlace = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { place_id } = req.body;
    await conn.query(QUERY.DELETE_PLACE, [id, place_id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Delete Sheet Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const getPlayerProfile = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const rows = await conn.query(QUERY.GET_PLAYER_PROFILE, [id]);

    if (rows.length > 0) return res.json({ player_profile: rows[0] });
    else return res.send({});
  } catch (err) {
    console.error("Get Player Profile Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const updatePlayerProfile = async (req, res) => {
  let conn, query;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const data = req.body;
    const rows = await conn.query(QUERY.GET_PLAYER_PROFILE, [id]);
    if (rows.length > 0) {
      // Update Profile
      let queryString = [];
      for (let key in data) {
        if (!!data[key]) {
          queryString.push(`${key}='${data[key]}'`);
        }
      }
      if (queryString.length > 0) {
        queryString = queryString.join(",");
        query = `update player_profile set ${queryString} where user_id='${id}'`;
        await conn.query(query);
      }
    } else {
      // Insert Profile
      let keys = [];
      let values = [];
      for (let key in data) {
        if (data[key] !== "") {
          keys.push(key);
          values.push(`'${data[key]}'`);
        }
      }
      if (keys.length > 0) {
        const query = `insert into player_profile (user_id, ${keys.join(
          ","
        )}) values ('${id}', ${values.join(",")})`;
        await conn.query(query);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Update Player Profile Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const findPlayers = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { name } = req.query;
    const rows = await conn.query(QUERY.FIND_PLAYER, [name]);

    return res.json({ players: rows });
  } catch (err) {
    console.error("Find Players Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const getTeam = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { team_id } = req.userInfo;
    const rows = await conn.query(QUERY.GET_TEAM, [team_id]);

    const members = await conn.query(QUERY.GET_TEAM_PLAYERS, [team_id]);

    return rows.length > 0
      ? res.json({ team: rows[0], members })
      : res.send(null);
  } catch (err) {
    console.error("Get Team Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const createTeam = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { name, description } = req.body;
    const newTeamId = v4();
    await conn.query(QUERY.CREATE_TEAM, [newTeamId, id, name, description]);
    await conn.query(QUERY.REGISTER_PLAYER, [newTeamId, id]);

    req.userInfo.team_id = newTeamId;
    res
      .cookie(
        "session",
        JSON.stringify({ ...req.session, userInfo: req.userInfo }),
        { httpOnly: true, sameSite: "None", secure: true }
      )
      .sendStatus(200);
  } catch (err) {
    console.error("Create Team Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const inviteTeam = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { team_id, user_id, team_name } = req.body;
    const content = {
      team_name: team_name,
    };

    await conn.query(QUERY.INVITE_TEAM, [
      team_id,
      user_id,
      JSON.stringify(content),
    ]);

    res.sendStatus(200);
  } catch (err) {
    console.error("Invite Team Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const getTeamInvitations = async (req, res) => {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    const { id, role } = req.userInfo;
    const { team_id } = req.query;
    if (role === 1) {
      rows = await conn.query(QUERY.GET_TEAM_INVITATIONS, [id, id]);
    } else if (role === 2) {
      rows = await conn.query(QUERY.GET_TEAM_INVITATIONS, [team_id, team_id]);
    }

    return res.json({ invitations: rows });
  } catch (err) {
    console.error("Get Invitations Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const acceptTeamInvitation = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { team_id } = req.body;

    await conn.query(QUERY.ACCEPT_TEAM_INVITATION, [team_id, id]);
    await conn.query(QUERY.DELETE_TEAM_INVITATION, [id, team_id]);

    res.sendStatus(200);
  } catch (err) {
    console.error("Accept Invitation Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const deleteTeamInvitation = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const { team_id } = req.body;

    await conn.query(QUERY.DELETE_TEAM_INVITATION, [id, team_id]);

    res.sendStatus(200);
  } catch (err) {
    console.error("Delete Invitation Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const getNotifications = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id } = req.userInfo;
    const payload = {};
    payload.invitations = await conn.query(QUERY.GET_PLAYER_INVITATIONS, [id]);

    return res.json(payload);
  } catch (err) {
    console.error("Get Notifications Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const addTeamTrain = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { players, team_id, distance, arrowCount, endCount, place } =
      req.body;

    const [results] = await Promise.all(
      players.map(
        async (player) =>
          await conn.query(QUERY.ADD_TEAM_TRAIN, [
            player,
            team_id,
            distance,
            arrowCount,
            endCount,
            place,
          ])
      )
    );
    res.json({ train: results[0] });
  } catch (err) {
    console.error("Add Team Train Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const getTeamTrains = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { team_id } = req.userInfo;
    const rows = await conn.query(QUERY.GET_TEAM_TRAINS, [team_id]);

    return res.json({ trains: rows });
  } catch (err) {
    console.error("Get Team Train Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const getTeamTrain = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { team_id, create_time } = req.query;
    const rows = await conn.query(QUERY.GET_TEAM_TRAIN, [team_id, create_time]);

    return res.json({ players: rows });
  } catch (err) {
    console.error("Get Team Train Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const getTeamEnds = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { train_id, player_id } = req.query;
    const rows = await conn.query(QUERY.GET_ENDS, [player_id, train_id]);

    return res.json({ ends: rows });
  } catch (err) {
    console.error("Get Team Ends Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const addTeamEnd = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { train_id, player_id, scores } = req.body;
    await conn.query(QUERY.ADD_TEAM_END, [
      player_id,
      train_id,
      JSON.stringify(scores),
    ]);
    await updateTrainStats({ conn, user_id: player_id, train_id });
    res.sendStatus(200);
  } catch (err) {
    console.error("Add Team End Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const updateTeamEnd = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { train_id, player_id, end_id, scores } = req.body;

    await conn.query(QUERY.UPDATE_TEAM_END, [
      JSON.stringify(scores),
      end_id,
      player_id,
    ]);
    await updateTrainStats({ conn, user_id: player_id, train_id });

    res.sendStatus(200);
  } catch (err) {
    console.error("Update Team End Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const getTeamPlayerTrains = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { player_id } = req.query;
    const rows = await conn.query(QUERY.GET_TRAINS, [player_id]);

    return res.json({ trains: rows });
  } catch (err) {
    console.error("Get Team Player Train Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
module.exports = {
  getUserProfile,
  upateUserName,
  getUserData,
  getPlaces,
  getTrain,
  getTrains,
  getEnds,
  addProfile,
  addSheet,
  addTrain,
  addEnd,
  addPlace,
  deleteSheet,
  deleteTrain,
  deletePlace,
  updateSheet,
  updateTrain,
  updateEnd,
  updateEnds,
  getPlayerProfile,
  updatePlayerProfile,
  findPlayers,
  getTeam,
  createTeam,
  inviteTeam,
  getTeamInvitations,
  acceptTeamInvitation,
  deleteTeamInvitation,
  getNotifications,
  getTeamTrains,
  getTeamTrain,
  addTeamTrain,
  getTeamEnds,
  addTeamEnd,
  updateTeamEnd,
  getTeamPlayerTrains,
};
