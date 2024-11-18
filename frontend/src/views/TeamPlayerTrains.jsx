import { Box, Button, Dialog, MenuItem, Typography } from "@mui/material";
import { URL } from "constants/url";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { requestGet } from "utils/fetch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrainStats from "components/train/TrainStats";

const TeamPlayerTrains = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState();
  const [trains, setTrains] = useState([]);
  const [train, setTrain] = useState();
  const [groupedTrains, setGroupedTrains] = useState({});
  const location = useLocation();
  const getPlayerTrains = async () => {
    const requestOptions = {
      params: { player_id: player.id },
    };
    const response = await requestGet(
      URL.GET_TEAM_PLAYER_TRAINS,
      requestOptions
    );
    if (response.status === 200) {
      const { trains } = response.data;
      const grouped = trains.reduce((acc, train) => {
        const monthKey = dayjs(train.create_time).format("YYYY-MM");
        if (!acc[monthKey]) {
          acc[monthKey] = {
            maxScore: train.total_score,
            minScore: train.total_score,
          };
        }
        acc[monthKey].maxScore = Math.max(
          acc[monthKey].maxScore,
          train.total_score
        );
        acc[monthKey].minScore = Math.min(
          acc[monthKey].minScore,
          train.total_score
        );
        return acc;
      }, {});
      setGroupedTrains(grouped);
      setTrains(trains);
    }
  };
  useEffect(() => {
    if (!location?.state?.player) return;
    setPlayer(location.state.player);
  }, []);
  useEffect(() => {
    if (!player) return;
    getPlayerTrains();
  }, [player]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 1,
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Button sx={{ p: 1 }} onClick={() => navigate(URL.TEAM)}>
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">
          훈련일지 {player && `[${player.name}]`}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {Object.keys(groupedTrains).length > 0 && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowY: "auto",
            }}
          >
            {Object.entries(groupedTrains)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([month, data]) => (
                <Box
                  key={month}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 0.5,
                    p: 1,
                    fontSize: 18,
                    border: "1px solid #ccc",
                  }}
                >
                  <Box sx={{ fontWeight: "bold", fontSize: 20 }}>{month}</Box>
                  <Box>
                    [ 최고: {data.maxScore}, 최저: {data.minScore} ]
                  </Box>
                </Box>
              ))}
          </Box>
        )}
      </Box>
      {train && (
        <Dialog open={Boolean(train)} fullScreen>
          <TrainStats
            player={player}
            train={train}
            close={() => setTrain(null)}
          />
        </Dialog>
      )}
    </Box>
  );
};

export default TeamPlayerTrains;
