import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { VIEW } from "../constants/state";
import SheetView from "./SheetView";
import ProfileView from "./ProfileView";
import NotificationView from "./NotificationView";
import SettingView from "./SettingView";

const MainView = () => {
  const [value, setValue] = useState(VIEW.SHEET);
  const components = {
    [VIEW.SHEET]: <SheetView />,
    [VIEW.PROFILE]: <ProfileView />,
    [VIEW.NOTIFICATION]: <NotificationView />,
    [VIEW.SETTING]: <SettingView />,
  };
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
      <Box flex={1}>{components[value] && components[value]}</Box>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        sx={{ borderTop: "2px solid #000" }}
      >
        <BottomNavigationAction label="기록" icon={<EditNoteIcon />} />
        <BottomNavigationAction label="내 정보" icon={<PersonIcon />} />
        <BottomNavigationAction label="알림" icon={<NotificationsIcon />} />
        <BottomNavigationAction label="설정" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
};
export default MainView;
