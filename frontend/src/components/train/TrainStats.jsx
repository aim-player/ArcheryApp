import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { requestGet } from "utils/fetch";
import { URL } from "constants/url";

const TrainStats = ({ close, train, player }) => {
  const [ends, setEnds] = useState([]);
  const [endScores, setEndScores] = useState([]);
  const convertChartData = () => {
    const convertScore = (score) => {
      if (score === "M") return 0;
      if (score === "X") return 10;
      return score;
    };

    const data = ends.map((end) => {
      let score = 0;
      const scores = JSON.parse(end.scores);
      scores.forEach((s) => {
        if (s) score += convertScore(s);
      });
      end.score = score;
      return score;
    });
    setEndScores(data);
  };
  const getEnds = async () => {
    const requestOptions = {
      params: { train_id: train.id, player_id: player?.id },
    };
    const response = await requestGet(
      player ? URL.GET_TEAM_ENDS : URL.GET_ENDS,
      requestOptions
    );
    if (response.status === 200) {
      const { ends } = response.data;
      setEnds(ends);
    }
  };
  useEffect(() => {
    getEnds();
  }, []);
  useEffect(() => {
    if (ends.length > 0) convertChartData();
  }, [ends]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body">통계</Typography>
        <Button variant="contained" sx={{ p: 0.5 }} onClick={close}>
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ flex: 1 }}>
        <LineChart
          series={[{ type: "line", data: endScores, curve: "linear" }]}
          xAxis={[
            {
              scaleType: "band",
              data: Array(endScores.length)
                .fill(0)
                .map((_, i) => i + 1 + "엔드"),
            },
          ]}
          height={200}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
              gap: 1,
              border: "2px solid #ccc",
              borderRadius: 1,
            }}
          >
            <Box>총점</Box>
            <Box>
              {endScores.length > 0
                ? endScores.reduce((sum, cur) => (sum += cur))
                : 0}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
              gap: 1,
              border: "2px solid #ccc",
              borderRadius: 1,
            }}
          >
            <Box>엔드당 평균 점수</Box>
            <Box>
              {endScores.length > 0
                ? (
                    endScores.reduce((sum, cur) => (sum += cur)) /
                    endScores.length
                  ).toFixed(2)
                : 0}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Box>
  );
};

export default TrainStats;
