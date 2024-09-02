const { jwtDecode } = require("jwt-decode");
const { v4 } = require("uuid");

const { QUERY } = require("../constants/query");
const { pool } = require("../mariadb");

const authenticateUser = async (req, res) => {
  const data = req.body;
  const platform = data.platform;
  if (!platform) return res.status(500).send("PLF Error 1");
  let userInfo = null;

  switch (platform) {
    case "google":
      userInfo = await getUser(platform, data.user.email);
      if (!userInfo) userInfo = await createUser(platform, data.user.email);
      const { exp } = jwtDecode(data.idToken);
      res
        .cookie(
          "session",
          JSON.stringify({
            platform,
            idToken: data.idToken,
            userInfo,
            expiry_date: exp * 1000,
          }),
          { httpOnly: true }
        )
        .json({ userInfo });
      break;
    default:
      res.status(500).send("PLF Error 2");
  }
};

const getUser = async (platform, email) => {
  let conn;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_USER, [platform, email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Get User Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};
const createUser = async (platform, email) => {
  let conn;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(QUERY.CREATE_USER, [v4(), platform, email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Create User Error: ", err);
    res.sendStatus(500);
  } finally {
    if (conn) conn.release();
  }
};

const validateSession = (req, res, next) => {
  const { session } = req.cookies;
  if (!session) return res.send(null);

  req.session = JSON.parse(session);
  req.userInfo = JSON.parse(session).userInfo;

  const expired = req.session.expiry_date < Date.now();
  if (expired) return res.status(401).send("Session Expired");

  return next();
};

const refreshSession = async (req, res) => {
  const { session } = req.cookies;
  if (!session) return res.send(null);

  req.session = JSON.parse(session);
  req.userInfo = JSON.parse(session).userInfo;
  const expired = req.session.expiry_date < Date.now();
  if (expired) {
    res.clearCookie("session");
    return res.sendStatus(501);
  } else {
    const userInfo = await getUser(req.userInfo.platform, req.userInfo.email);
    return res.json(userInfo);
  }
};

module.exports = {
  authenticateUser,
  validateSession,
  refreshSession,
};
