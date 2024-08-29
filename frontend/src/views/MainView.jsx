import { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsIcon from "@mui/icons-material/Settings";

import HomeView from "./HomeView";
import SheetsView from "./SheetsView";
import ProfileView from "./ProfileView";
import NotificationView from "./NotificationView";
import SettingView from "./SettingView";

import { VIEW } from "../constants/state";
import PopupView from "./PopupView";
import { useUser } from "utils/context";
import { useNavigate } from "react-router-dom";
import { URL } from "constants/url";

const MainView = () => {
  const navigate = useNavigate();
  const [user] = useUser();
  const [value, setValue] = useState(VIEW.HOME);
  const components = {
    [VIEW.HOME]: <HomeView />,
    [VIEW.SHEETS]: <SheetsView />,
    [VIEW.PROFILE]: <ProfileView />,
    [VIEW.NOTIFICATION]: <NotificationView />,
    [VIEW.SETTING]: <SettingView />,
  };

  useEffect(() => {
    if (user) {
      const { role, name } = user;
      if (!role || !name) navigate(URL.PROFILE_INIT);
    }
  }, [value]);
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {components[value] && components[value]}
      </Box>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        sx={{ borderTop: "2px solid #000" }}
      >
        <BottomNavigationAction label="홈" icon={<HomeIcon />} />
        <BottomNavigationAction label="기록" icon={<EditNoteIcon />} />
        {/* <BottomNavigationAction label="알림" icon={<NotificationsIcon />} /> */}
        <BottomNavigationAction label="설정" icon={<SettingsIcon />} />
      </BottomNavigation>
      <PopupView />
    </Box>
  );
};
export default MainView;
