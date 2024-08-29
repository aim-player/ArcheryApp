import { Box, Button, List, MenuItem, Select, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { ARROW_COUNT, DISTANCE, END_COUNT } from "constants/rule";
import { requestFetch, useDataLoader } from "App";
import { requestPost } from "utils/fetch";
import { URL } from "constants/url";
import { useEnds, useRounds } from "utils/context";

const RoundCreate = ({ sheet, editTarget, close }) => {
  const loadData = useDataLoader();
  const [ends] = useEnds();
  const [inputs, setInputs] = useState({
    distance: DISTANCE[3],
    arrowCount: ARROW_COUNT[1],
    endCount: END_COUNT[5],
  });

  const generateRoundId = () => {
    let id = 1;
    if (sheet.rounds && sheet.rounds.length > 0) {
      sheet.rounds.forEach((round) => {
        if (round.id >= id) id = round.id + 1;
      });
    }
    return id;
  };

  const addRound = async () => {
    const payload = {
      sheet_id: sheet.id,
      ...inputs,
    };
    const requestOptions = {
      data: payload,
    };
    const response = await requestPost(URL.ADD_ROUND, requestOptions);
    if (response.status === 200) {
      loadData();
      close();
    }
    // const newRound = {
    //   id: generateRoundId(),
    //   ...inputs,
    // };
    // const rounds = sheet.rounds ? [...sheet.rounds, newRound] : [newRound];
    // requestFetch("update_sheet", { ...sheet, rounds });
    // close();
  };
  const updateEnds = async () => {
    const targetEnds = [...ends.filter((e) => e.round_id === editTarget.id)];
    if (targetEnds.length === 0) return;

    const updatedEnds =
      editTarget.arrow_count > inputs.arrowCount
        ? targetEnds.map((end) => {
            end.scores = JSON.stringify(
              JSON.parse(end.scores).splice(0, inputs.arrowCount)
            );

            return end;
          })
        : targetEnds.map((end) => {
            end.scores = JSON.stringify([
              ...JSON.parse(end.scores),
              ...Array(inputs.arrowCount - editTarget.arrow_count).fill(null),
            ]);
            return end;
          });

    const requestOptions = {
      data: {
        endCount: inputs.endCount,
        ends: updatedEnds,
      },
    };
    const response = await requestPost(URL.UPDATE_END_ALL, requestOptions);
    if (response.status === 200) {
      loadData();
    }
  };
  const updateRound = async () => {
    const payload = {
      round_id: editTarget.id,
      ...inputs,
    };
    const requestOptions = {
      data: payload,
    };
    const response = await requestPost(URL.UPDATE_ROUND, requestOptions);
    await updateEnds();

    if (response.status === 200) {
      loadData();
      close();
    }
    // const rounds = appData.rounds ? appData.rounds: {};
    // const sheetRounds = rounds[sheet.created_at];
    // if (sheetRounds)
    //   rounds[sheet.created_at] = rounds[sheet.created_at].map((s) => {
    //     if (s.id === editTarget.id) return { id: s.id, ...inputs };
    //     else return s;
    //   });
    // else rounds[sheet.created_at] = [];
    // setAppData((state) => ({ ...state, rounds }));
    // close();
  };
  const applyEditTarget = () =>
    setInputs({
      ...editTarget,
      arrowCount: editTarget.arrow_count,
      endCount: editTarget.end_count,
    });
  useEffect(() => {
    if (editTarget) applyEditTarget();
  }, []);
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
          {editTarget ? "수정하기" : "시작하기"}
        </Button>
      </Box>
    </Box>
  );
};

export default RoundCreate;
