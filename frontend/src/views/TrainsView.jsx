import { useEffect, useState } from "react";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { requestGet } from "utils/fetch";
import { URL } from "constants/url";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAlert, useUser } from "utils/context";

const TrainsView = () => {
  const [user] = useUser();
  const [, setAlert] = useAlert();
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);

  const getTrains = async () => {
    const response = await requestGet(URL.GET_TRAINS);
    if (response.status === 200) {
      const { trains } = response.data;
      setTrains(trains);
    }
  };

  const groupTrainsByMonth = (trains) => {
    const grouped = {};
    trains.forEach((train) => {
      const monthKey = dayjs(train.create_time).format("YYYY-MM");
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(train);
    });
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  };

  useEffect(() => {
    if (!user)
      return setAlert({
        active: true,
        message: "로그인이 필요합니다.",
        callbackFn: () => navigate("/"),
      });
    getTrains();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="h5">훈련일지</Typography>
        <Button
          sx={{ width: 40, height: 40 }}
          onClick={() => navigate(URL.ADD_TRAIN)}
        >
          <AddIcon />
        </Button>
      </Box>
      {trains.length > 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            overflowY: "auto",
          }}
        >
          {groupTrainsByMonth(trains).map(([month, monthTrains]) => (
            <Box key={month}>
              <Typography
                sx={{
                  bgcolor: "#e0e0e0",
                  px: 2,
                  py: 1,
                  fontWeight: "bold",
                }}
              >
                {dayjs(month).format("YYYY년 MM월")}
              </Typography>
              {monthTrains.map((train, index) => (
                <MenuItem
                  key={`train_${month}_${index}`}
                  onClick={() =>
                    navigate(URL.TRAIN, { state: { id: train.id } })
                  }
                  sx={{ bgcolor: "#f3f3f3" }}
                >
                  {dayjs(train.create_time).format("YYYY-MM-DD HH:mm")}
                </MenuItem>
              ))}
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ mr: 0.5 }}
            onClick={() => navigate(URL.ADD_TRAIN)}
          >
            <AddIcon />
          </Button>
          버튼을 눌러 시트를 추가해보세요!
        </Box>
      )}
    </Box>
  );
};
export default TrainsView;
