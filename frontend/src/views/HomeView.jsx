import {
  Avatar,
  Box,
  Button,
  Dialog,
  MenuItem,
  Typography,
} from "@mui/material";
import { useUser } from "utils/context";
import { requestFetch, useDataLoader } from "App";
import { useEffect, useState } from "react";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlayerProfileView from "./PlayerProfileView";

const HomeView = () => {
  const [user] = useUser();
  const loadData = useDataLoader();
  const [openPlayerProfile, setOpenPlayerProfile] = useState(false);

  useEffect(() => {
    if (user) loadData();
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
            <Button
              variant="contained"
              sx={{ p: 1 }}
              onClick={() => setOpenPlayerProfile(true)}
            >
              <PersonIcon />
            </Button>
            <Button variant="contained" sx={{ p: 1 }}>
              <NotificationsIcon />
            </Button>
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
            <Typography sx={{ fontWeight: "bold" }}>
              로그인이 필요해요.
            </Typography>
          </Box>
          <KeyboardArrowRightIcon fontSize="large" />
        </MenuItem>
      )}
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
                0
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
                0
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{ p: 1, fontWeight: "bold" }}
          >
            훈련하기
          </Button>
        </Box>
      </Box>
      <Dialog open={openPlayerProfile} fullScreen>
        <PlayerProfileView close={() => setOpenPlayerProfile(false)} />
      </Dialog>
    </Box>
  );
};
export default HomeView;
