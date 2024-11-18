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

  // 월별로 훈련 데이터를 그룹화하는 함수
  const groupTrainsByMonth = (trains) => {
    const grouped = {};
    trains.forEach((train) => {
      const monthKey = dayjs(train.create_time).format("YYYY-MM");
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(train);
    });
    return grouped;
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
        {Object.entries(groupTrainsByMonth(trains))
          .sort((a, b) => b[0].localeCompare(a[0])) // 최신 월이 위로 오도록 정렬
          .map(([month, monthTrains]) => (
            <Box key={month}>
              <Typography
                sx={{
                  bgcolor: "#f5f5f5",
                  p: 1,
                  fontWeight: "bold",
                }}
              >
                {dayjs(month).format("YYYY년 MM월")}
              </Typography>
              {monthTrains.map((train, i) => (
                <MenuItem
                  key={`train_${month}_${i}`}
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
          ))}
      </Box>
    </Box>
  );
};
export default TeamTrainsView;
