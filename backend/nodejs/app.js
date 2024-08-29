const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
require("./mariadb");

const { authenticateUser, validateSession, refreshSession } = require("./auth");
const {
  addProfile,
  addSheet,
  getUserData,
  addRound,
  addEnd,
  deleteSheet,
  deleteRound,
  updateSheet,
  updateRound,
  updateEnd,
  updateEnds,
} = require("./user");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8081"],
    credentials: true,
  })
);

app.get("/", (_, res) => res.send("Archery Server is healthy"));

// Login
app.get("/logout", (_, res) => res.clearCookie("session").sendStatus(200));
app.post("/login/oauth", authenticateUser);
app.get("/refresh_session", refreshSession);

// User
app.post("/user/profile", validateSession, addProfile);
app.get("/user/data", validateSession, getUserData);

// Sheet
app.post("/sheet/add", validateSession, addSheet);
app.post("/sheet/update", validateSession, updateSheet);
app.post("/sheet/delete", validateSession, deleteSheet);

app.post("/round/add", validateSession, addRound);
app.post("/round/update", validateSession, updateRound);
app.post("/round/delete", validateSession, deleteRound);

app.post("/end/add", validateSession, addEnd);
app.post("/end/update", validateSession, updateEnd);
app.post("/end/update_all", validateSession, updateEnds);

app.listen(8080, () => {
  console.log("======== Nodejs Server Started");
});
