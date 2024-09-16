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

const TrainStats = ({ close, train }) => {
  const [endScores, setEndScores] = useState([]);
  const convertChartData = () => {
    const convertScore = (score) => {
      if (score === "M") return 0;
      if (score === "X") return 10;
      return score;
    };

    const data = train.ends.map((end) => {
      let score = 0;
      end.data.forEach((s) => {
        if (s) score += convertScore(s);
      });
      end.score = score;
      return score;
    });
    setEndScores(data);
  };
  useEffect(() => {
    if (train.ends) {
      convertChartData();
    }
  }, []);
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
