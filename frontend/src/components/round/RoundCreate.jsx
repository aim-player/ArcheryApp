import { Box, Button, List, MenuItem, Select, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { ARROW_COUNT, DISTANCE, END_COUNT } from "constants/rule";
import dayjs from "dayjs";

const RoundCreate = ({ sheet, editTarget, close, loadRounds }) => {
  const [inputs, setInputs] = useState({
    distance: DISTANCE[3],
    arrowCount: ARROW_COUNT[1],
    endCount: END_COUNT[2],
  });
  const addRound = () => {
    const newRound = {
      id: dayjs().format("YYYYMMDDHHmmss"),
      ...inputs,
    };
    const savedRounds = localStorage.getItem("rounds")
      ? JSON.parse(localStorage.getItem("rounds"))
      : {};

    const sheetRounds = savedRounds[sheet.created_at];
    if (sheetRounds) sheetRounds.push(newRound);
    else savedRounds[sheet.created_at] = [newRound];

    localStorage.setItem("rounds", JSON.stringify(savedRounds));
    close();
    loadRounds();
  };
  const updateRound = () => {};
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        zIndex: 2,
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
        <Button variant="contained" sx={{ p: 1 }} onClick={close}>
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">
          라운드 {editTarget ? "수정" : "추가"}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 1,
          overflowY: "auto",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <List sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1 }}>거리</span>
            <Select
              sx={{ flex: 1, p: 1 }}
              value={inputs.distance}
              onChange={(e) =>
                setInputs((state) => ({ ...state, distance: e.target.value }))
              }
            >
              {DISTANCE.map((d) => (
                <MenuItem value={d} key={`distance_${d}`}>
                  {d}미터
                </MenuItem>
              ))}
            </Select>
          </List>
          <List sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1 }}>발 수</span>
            <Select
              sx={{ flex: 1, p: 1 }}
              value={inputs.arrowCount}
              onChange={(e) =>
                setInputs((state) => ({ ...state, arrowCount: e.target.value }))
              }
            >
              {ARROW_COUNT.map((d) => (
                <MenuItem value={d} key={`arrow_count_${d}`}>
                  {d}발
                </MenuItem>
              ))}
            </Select>
          </List>
          <List sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1 }}>엔드 수</span>
            <Select
              sx={{ flex: 1, p: 1 }}
              value={inputs.endCount}
              onChange={(e) =>
                setInputs((state) => ({ ...state, endCount: e.target.value }))
              }
            >
              {END_COUNT.map((d) => (
                <MenuItem value={d} key={`end_count_${d}`}>
                  {d}엔드
                </MenuItem>
              ))}
            </Select>
          </List>
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ p: 1 }}
          onClick={editTarget ? updateRound : addRound}
        >
          {editTarget ? "수정하기" : "추가하기"}
        </Button>
      </Box>
    </Box>
  );
};

export default RoundCreate;
