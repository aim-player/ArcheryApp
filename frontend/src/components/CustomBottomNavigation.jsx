import { BottomNavigation, BottomNavigationAction } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";
import { URL } from "constants/url";
import { useUser } from "utils/context";
import { useLocation, useNavigate } from "react-router-dom";
const CustomBottomNavigation = () => {
  const [user] = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <BottomNavigation
      showLabels
      value={location.pathname}
      onChange={(e, path) => navigate(path)}
      sx={{ borderTop: "1px solid #eee", "& .Mui-selected": { color: "#000" } }}
    >
      <BottomNavigationAction value={URL.HOME} label="홈" icon={<HomeIcon />} />
      <BottomNavigationAction
        value={user?.role === 2 ? URL.TEAM_TRAINS : URL.TRAINS}
        label="기록"
        icon={<EditNoteIcon />}
      />
      {user && user.role === 2 && (
        <BottomNavigationAction
          value={URL.TEAM}
          label="팀 관리"
          icon={<GroupsIcon />}
        />
      )}
      <BottomNavigationAction
        value={URL.SETTING}
        label="설정"
        icon={<SettingsIcon />}
      />
    </BottomNavigation>
  );
};

export default CustomBottomNavigation;
