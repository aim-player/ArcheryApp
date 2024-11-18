const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./mariadb");
console.log("ENV TEST: ", process.env.TEST);

const { authenticateUser, validateSession, refreshSession } = require("./auth");
const {
  upateUserName,
  addProfile,
  addSheet,
  getUserProfile,
  getUserData,
  getTrain,
  getTrains,
  addTrain,
  getEnds,
  addEnd,
  deleteSheet,
  deleteTrain,
  updateSheet,
  updateTrain,
  updateEnd,
  updateEnds,
  getPlaces,
  addPlace,
  deletePlace,
  getPlayerProfile,
  updatePlayerProfile,
  findPlayers,
  getPlayerEquipment,
  updatePlayerEquipment,
  getTeam,
  createTeam,
  inviteTeam,
  getTeamInvitations,
  acceptTeamInvitation,
  deleteTeamInvitation,
  getTeamTrains,
  getTeamTrain,
  addTeamTrain,
  getTeamEnds,
  addTeamEnd,
  updateTeamEnd,
  getTeamPlayerTrains,
  getNotifications,
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
app.post("/player/find", validateSession, findPlayers);
app.get("/player/equipment", validateSession, getPlayerEquipment);
app.post("/player/equipment/update", validateSession, updatePlayerEquipment);

// Sheet
app.post("/sheet/add", validateSession, addSheet);
app.post("/sheet/update", validateSession, updateSheet);
app.post("/sheet/delete", validateSession, deleteSheet);

// Train
app.get("/train", validateSession, getTrain);
app.get("/trains", validateSession, getTrains);
app.post("/train/add", validateSession, addTrain);
app.post("/train/update", validateSession, updateTrain);
app.post("/train/delete", validateSession, deleteTrain);

// End
app.get("/ends", validateSession, getEnds);
app.post("/end/add", validateSession, addEnd);
app.post("/end/update", validateSession, updateEnd);
app.post("/end/update_all", validateSession, updateEnds);

// Place
app.post("/place/add", validateSession, addPlace);
app.post("/place/delete", validateSession, deletePlace);

// Team
app.get("/team", validateSession, getTeam);
app.post("/team/create", validateSession, createTeam);
app.post("/team/invite", validateSession, inviteTeam);
app.get("/team/invite", validateSession, getTeamInvitations);
app.post("/team/invite/accept", validateSession, acceptTeamInvitation);
app.post("/team/invite/reject", validateSession, deleteTeamInvitation);
app.get("/team/trains", validateSession, getTeamTrains);
app.get("/team/train", validateSession, getTeamTrain);
app.post("/team/train/add", validateSession, addTeamTrain);
app.get("/team/ends", validateSession, getTeamEnds);
app.post("/team/end/add", validateSession, addTeamEnd);
app.post("/team/end/update", validateSession, updateTeamEnd);
app.get("/team/player/trains", validateSession, getTeamPlayerTrains);

// Notification
app.get("/notifications", validateSession, getNotifications);

app.listen(8080, () => {
  console.log("======== Nodejs Server Started");
});
