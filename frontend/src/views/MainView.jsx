import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import HomeView from "./HomeView";
import TrainsView from "./TrainsView";
import SettingView from "./SettingView";

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
    [VIEW.SHEETS]: <TrainsView />,
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
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {components[value] && components[value]}
      </Box>
    </Box>
  );
};
export default MainView;
