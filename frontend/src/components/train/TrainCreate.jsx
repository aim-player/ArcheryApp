import { Box, Button, List, MenuItem, Select, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { ARROW_COUNT, DISTANCE, END_COUNT } from "constants/rule";
import { requestPost } from "utils/fetch";
import { URL } from "constants/url";
import { useNavigate } from "react-router-dom";
import PlaceSelector from "./PlaceSelector";

const TrainCreate = () => {
  const navigate = useNavigate();
  const [openPlaceDialog, setOpenPlaceDialog] = useState(false);
  const [inputs, setInputs] = useState({
    distance: DISTANCE[3],
    arrowCount: ARROW_COUNT[1],
    endCount: END_COUNT[5],
    place: "",
  });

  const addTrain = async () => {
    const requestOptions = {
      data: inputs,
    };
    const response = await requestPost(URL.ADD_TRAIN, requestOptions);
    if (response.status === 200) {
      const { id } = response.data;
      navigate(URL.TRAIN, { state: { id } });
    }
  };

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
        <Button sx={{ p: 1 }} onClick={() => navigate(URL.TRAINS)}>
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">훈련 추가</Typography>
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
          <List sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1 }}>장소</span>
            <Button
              onClick={() => setOpenPlaceDialog(true)}
              variant="outlined"
              sx={{
                flex: 1,
                p: 1,
                "&.MuiButton-root": {
                  justifyContent: "flex-start",
                  color: "#000",
                  fontWeight: "normal",
                },
              }}
            >
              {inputs.place ? inputs.place : "장소 선택"}
            </Button>
            <PlaceSelector
              open={openPlaceDialog}
              onClose={() => setOpenPlaceDialog(false)}
              onSelect={(place) => setInputs((state) => ({ ...state, place }))}
            />
          </List>
        </Box>
        <Button fullWidth variant="contained" sx={{ p: 1 }} onClick={addTrain}>
          시작하기
        </Button>
      </Box>
    </Box>
  );
};

export default TrainCreate;
