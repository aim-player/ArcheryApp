import { Box, MenuItem, Typography } from "@mui/material";
import { URL } from "constants/url";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert, useUser } from "utils/context";
import { requestGet } from "utils/fetch";
import dayjs from "dayjs";
const TeamTrainsView = () => {
  const [user] = useUser();
  const navigate = useNavigate();
  const [, setAlert] = useAlert();
  const [trains, setTrains] = useState([]);

  const getTeamTrains = async () => {
    const response = await requestGet(URL.TEAM_TRAINS);
    if (response.status === 200) {
      const { trains } = response.data;
      setTrains(trains);
    }
  };
  useEffect(() => {
    if (!user || user.role !== 2)
      return setAlert({
        active: true,
        message: "잘못된 접근입니다.",
        callbackFn: () => navigate("/"),
      });
    getTeamTrains();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="h5">팀 훈련일지</Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {trains.map((train, i) => (
          <MenuItem
            key={`train_${i}`}
            sx={{ border: "1px solid #eee" }}
            onClick={() =>
              navigate(URL.TEAM_TRAIN, {
                state: {
                  team_id: user.team_id,
                  train,
                },
              })
            }
          >
            {dayjs(train.create_time).format("YYYY-MM-DD HH:mm:ss")}
          </MenuItem>
        ))}
      </Box>
    </Box>
  );
};
export default TeamTrainsView;
