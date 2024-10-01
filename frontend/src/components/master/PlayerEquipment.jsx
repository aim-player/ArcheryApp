import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useAlert } from "utils/context";
import { URL } from "constants/url";
import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";

const Menu = {
  BOW: "bow",
  ARROW: "arrow",
};
const Types = {
  [Menu.BOW]: [
    { name: "핸들", type: "handle" },
    { name: "날개", type: "wing" },
    { name: "조준기", type: "sight" },
    { name: "스태빌라이저", type: "stabilizer" },
    { name: "쿠션", type: "cushion" },
    { name: "현사", type: "string" },
  ],
  [Menu.ARROW]: [
    { name: "샤프트", type: "shaft" },
    { name: "포인트", type: "point" },
    { name: "노크", type: "knock" },
    { name: "깃", type: "feather" },
    { name: "핀", type: "pin" },
  ],
};
const PlayerEquipment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setAlert] = useAlert();

  const [tab, setTab] = useState(Menu.BOW);
  const [bowTab, setBowTab] = useState(Types[Menu.BOW][0].type);
  const [arrowTab, setArrowTab] = useState(Types[Menu.ARROW][0].type);
  const getPlayerEquipment = async () => {
    if (!location.state || !location.state.player_id)
      return setAlert({
        active: true,
        message: "잘못된 접근입니다.",
        callbackFn: () => navigate("/"),
      });
    const player_id = location.state.player_id;
    const requestOptions = {
      params: { player_id },
    };
    // const response = await getPlayerEquipment(URL.GET_PLAYER_)
  };
  useEffect(() => {
    getPlayerEquipment();
  }, []);
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="h5">장비 설정</Typography>
        <Button
          variant="contained"
          sx={{ p: 1 }}
          onClick={() => navigate(URL.TEAM)}
        >
          <CloseIcon />
        </Button>
      </Box>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="활" value={Menu.BOW} />
        <Tab label="화살" value={Menu.ARROW} />
      </Tabs>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontSize: 12,
          overflow: "auto",
        }}
      >
        {tab === Menu.BOW && (
          <Tabs
            value={bowTab}
            onChange={(_, value) => setBowTab(value)}
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons={"auto"}
          >
            {Types[Menu.BOW].map((bow, i) => (
              <Tab
                key={`bow_${i}`}
                label={bow.name}
                value={bow.type}
                sx={{
                  p: 0,
                  "&.MuiButtonBase-root": {
                    border: "1px solid #ddd",
                  },
                }}
              />
            ))}
          </Tabs>
        )}
        {tab === Menu.ARROW && (
          <Tabs
            value={arrowTab}
            onChange={(_, value) => setArrowTab(value)}
            variant="scrollable"
            allowScrollButtonsMobile
            scrollButtons={"auto"}
          >
            {Types[Menu.ARROW].map((arrow, i) => (
              <Tab
                key={`bow_${i}`}
                label={arrow.name}
                value={arrow.type}
                sx={{
                  p: 0,
                  "&.MuiButtonBase-root": {
                    border: "1px solid #ddd",
                  },
                }}
              />
            ))}
          </Tabs>
        )}
      </Box>
      <Box sx={{ p: 1 }}>
        <Button fullWidth variant="contained" sx={{ p: 1 }}>
          저장하기
        </Button>
      </Box>
    </Box>
  );
};
export default PlayerEquipment;
