import { Box, Button, Dialog, MenuItem, Typography } from "@mui/material";
import { useAlert, useUser } from "utils/context";
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
import ConstructionIcon from "@mui/icons-material/Construction";

const HomeView = () => {
  const navigate = useNavigate();
  const [user] = useUser();
  const [openPlayerProfile, setOpenPlayerProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

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
            boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>{user.name}</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {user.role === 1 && (
              <>
                <Button
                  color="inherit"
                  sx={{ p: 1 }}
                  onClick={() =>
                    navigate(URL.PLAYER_EQUIPMENT, {
                      state: { player_id: user.id },
                    })
                  }
                >
                  <ConstructionIcon />
                </Button>
                <Button
                  color="inherit"
                  sx={{ p: 1 }}
                  onClick={() => setOpenPlayerProfile(true)}
                >
                  <PersonIcon />
                </Button>
              </>
            )}

            <Button
              color="inherit"
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
          color="inherit"
          onClick={() => requestFetch("login")}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            p: 2,
            boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
  const [, setAlert] = useAlert();
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
  const addTrain = () => {
    if (!user)
      return setAlert({ active: true, message: "로그인이 필요합니다." });
    navigate(URL.ADD_TRAIN);
  };
  useEffect(() => {
    if (user) getTrains();
  }, [user]);

  useEffect(() => {
    calcStats();
  }, [trains]);

  return (
    <Box>
      {((user && user.role !== 2) || !user) && (
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography sx={{ fontSize: 20, mb: 1 }}>내 기록</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                p: 1,
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
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                p: 1,
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
            color="inherit"
            variant="outlined"
            sx={{ p: 1, fontSize: 18 }}
            onClick={addTrain}
          >
            훈련하기
          </Button>
        </Box>
      )}
      {user && user.role === 2 && (
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ p: 1, fontWeight: "bold" }}
            onClick={() => navigate(URL.ADD_TEAM_TRAIN)}
          >
            팀 훈련시작
          </Button>
        </Box>
      )}
    </Box>
  );
};
