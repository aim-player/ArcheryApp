import {
  Avatar,
  Box,
  Button,
  Dialog,
  MenuItem,
  Typography,
} from "@mui/material";
import { useUser } from "utils/context";
// import { requestFetch, useDataLoader } from "App";
import { requestFetch } from "App";
import { useEffect, useState } from "react";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlayerProfileView from "./PlayerProfileView";
import { useNavigate } from "react-router-dom";
import { URL } from "constants/url";
import { requestGet } from "utils/fetch";
import NotificationView from "./NotificationView";

const HomeView = () => {
  const navigate = useNavigate();
  const [user] = useUser();
  // const loadData = useDataLoader();
  const [openPlayerProfile, setOpenPlayerProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  useEffect(() => {
    // if (user) loadData();
  }, []);
  return (
    <Box>
      {user ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            p: 2,
            borderBottom: "2px solid #000",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>{user.name}</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {user.role === 1 && (
              <Button
                variant="contained"
                sx={{ p: 1 }}
                onClick={() => setOpenPlayerProfile(true)}
              >
                <PersonIcon />
              </Button>
            )}
            <Button
              variant="contained"
              sx={{ p: 1 }}
              onClick={() => setOpenNotifications(true)}
            >
              <NotificationsIcon />
            </Button>
            {openNotifications && (
              <NotificationView close={() => setOpenNotifications(false)} />
            )}
          </Box>
        </Box>
      ) : (
        <MenuItem
          // onClick={() => setPopup((state) => ({ ...state, login: true }))}
          onClick={() => requestFetch("login")}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            p: 2,
            borderBottom: "2px solid #000",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <Avatar /> */}
            <Typography sx={{ fontWeight: "bold" }}>로그인</Typography>
          </Box>
          <KeyboardArrowRightIcon fontSize="large" />
        </MenuItem>
      )}
      <TrainLogs />
      <Dialog open={openPlayerProfile} fullScreen>
        <PlayerProfileView close={() => setOpenPlayerProfile(false)} />
      </Dialog>
    </Box>
  );
};
export default HomeView;

const TrainLogs = () => {
  const [user] = useUser();
  const [trains, setTrains] = useState([]);
  const [stats, setStats] = useState({ totalScore: 0, totalShot: 0 });
  const navigate = useNavigate();

  const getTrains = async () => {
    const response = await requestGet(URL.GET_TRAINS);
    if (response.status === 200) {
      const { trains } = response.data;
      setTrains(trains);
    }
  };

  const calcStats = () => {
    const totalScore = trains.reduce(
      (sum, train) => sum + train.total_score,
      0
    );
    const totalShot = trains.reduce((sum, train) => sum + train.total_shot, 0);
    setStats({ totalScore, totalShot });
  };
  useEffect(() => {
    if (user) getTrains();
  }, [user]);

  useEffect(() => {
    calcStats();
  }, [trains]);
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ p: 2, border: "1px solid #333", borderRadius: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: "bold", mb: 1 }}>
          내 기록
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #333",
              p: 1,
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>총 발수</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {stats.totalShot}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #333",
              p: 1,
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>평균 점수</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {stats.totalShot > 0
                ? (stats.totalScore / stats.totalShot).toFixed(2)
                : 0}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ p: 1, fontWeight: "bold" }}
          onClick={() => navigate(URL.ADD_TRAIN)}
        >
          훈련하기
        </Button>
      </Box>
    </Box>
  );
};
