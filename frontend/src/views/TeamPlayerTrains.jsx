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
        <Button
          variant="contained"
          sx={{ p: 1 }}
          onClick={() => navigate(URL.TEAM)}
        >
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">
          훈련일지 {player && `[${player.name}]`}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {trains.length > 0 && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              overflowY: "auto",
            }}
          >
            {trains.map((train, index) => (
              <MenuItem
                key={`train_${index}`}
                onClick={() => setTrain(train)}
                sx={{ bgcolor: "#f3f3f3" }}
              >
                {dayjs(train.create_time).format("YYYY-MM-DD HH:mm")}
              </MenuItem>
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
