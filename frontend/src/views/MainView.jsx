import { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";

import HomeView from "./HomeView";
import SheetsView from "./SheetsView";
import SettingView from "./SettingView";
import PopupView from "./PopupView";

import { VIEW } from "../constants/state";
import { useUser } from "utils/context";
import { useNavigate } from "react-router-dom";
import { URL } from "constants/url";
import GroupView from "./GroupView";

const MainView = () => {
  const navigate = useNavigate();
  const [user] = useUser();
  const [value, setValue] = useState(VIEW.HOME);
  const components = {
    [VIEW.HOME]: <HomeView setMenu={(v) => setValue(v)} />,
    [VIEW.SHEETS]: <SheetsView />,
    [VIEW.SETTING]: <SettingView />,
    [VIEW.GROUP]: <GroupView />,
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
        onChange={(e, newValue) => {
          setValue(newValue);
          console.log(newValue);
          console.log(e);
        }}
        sx={{ borderTop: "2px solid #000" }}
      >
        <BottomNavigationAction
          value={VIEW.HOME}
          label="홈"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          value={VIEW.SHEETS}
          label="기록"
          icon={<EditNoteIcon />}
        />
        {user && user.role === 2 && (
          <BottomNavigationAction
            value={VIEW.GROUP}
            label="팀 관리"
            icon={<GroupsIcon />}
          />
        )}
        <BottomNavigationAction
          value={VIEW.SETTING}
          label="설정"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
      <PopupView />
    </Box>
  );
};
export default MainView;
