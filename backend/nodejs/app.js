const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./mariadb");
console.log("ENV TEST: ", process.env.TEST)

const { authenticateUser, validateSession, refreshSession } = require("./auth");
const {
  upateUserName,
  addProfile,
  addSheet,
  getUserProfile,
  getUserData,
  addRound,
  addEnd,
  deleteSheet,
  deleteRound,
  updateSheet,
  updateRound,
  updateEnd,
  updateEnds,
  getPlaces,
  addPlace,
  deletePlace,
  getPlayerProfile,
  updatePlayerProfile,
  getTeam,
} = require("./user");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:3000", "http://localhost:8081"],
    credentials: true,
  })
);

app.get("/", (_, res) => res.send("Archery Server is healthy"));

// Login
app.get("/logout", (_, res) => res.clearCookie("session").sendStatus(200));
app.post("/login/oauth", authenticateUser);
app.get("/refresh_session", refreshSession);

// User
app.post("/user/name", validateSession, upateUserName);
app.post("/user/profile", validateSession, addProfile);
app.get("/user/profile", validateSession, getUserProfile);
app.get("/user/data", validateSession, getUserData);
app.get("/user/places", validateSession, getPlaces);

// Player
app.get("/player/profile/get", validateSession, getPlayerProfile);
app.post("/player/profile/update", validateSession, updatePlayerProfile);

// Sheet
app.post("/sheet/add", validateSession, addSheet);
app.post("/sheet/update", validateSession, updateSheet);
app.post("/sheet/delete", validateSession, deleteSheet);

// Round
app.post("/round/add", validateSession, addRound);
app.post("/round/update", validateSession, updateRound);
app.post("/round/delete", validateSession, deleteRound);

// End
app.post("/end/add", validateSession, addEnd);
app.post("/end/update", validateSession, updateEnd);
app.post("/end/update_all", validateSession, updateEnds);

// Place
app.post("/place/add", validateSession, addPlace);
app.post("/place/delete", validateSession, deletePlace);

// Team
app.get("/team", validateSession, getTeam);

app.listen(8080, () => {
  console.log("======== Nodejs Server Started");
});
