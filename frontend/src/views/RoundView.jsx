import { useEffect, useState } from "react";
import {
  Box,
  DialogTitle,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Dialog,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PieChartIcon from "@mui/icons-material/PieChart";
import AddIcon from "@mui/icons-material/Add";

import RoundCreate from "components/round/RoundCreate";
import dayjs from "dayjs";
import { SCORE_COLOR } from "constants/rule";

const ButtonPad = [
  ["X", 10, "M", "ERASE"],
  [7, 8, 9, "SAVE"],
  [4, 5, 6],
  [1, 2, 3],
];

const RoundView = ({ sheet, round, setRound, close }) => {
  const [anchorEl, setAnchorEl] = useState();
  const [editTarget, setEditTarget] = useState();
  const [openEditor, setOpenEditor] = useState(false);
  const [currentEnd, setCurrentEnd] = useState();

  const editRound = () => {
    setEditTarget(round);
    setAnchorEl(null);
  };
  const deleteRound = () => {};
  const addEnd = (end) => {
    // if (roundEnds >= round.endCount) return;
    // const newEnd = {
    //   id: dayjs().format("YYYYMMDDHHmmss"),
    //   data: end,
    // };
    // const updatedEnds = [...roundEnds, newEnd];
    // ends[round.id] = updatedEnds;
    // sendConsoleLog("======: " + JSON.stringify(ends));
    // setAppData((state) => ({ ...state, ends }));
    // setOpenEditor(false);
  };
  const editEnd = (end) => {
    setCurrentEnd(end);
    setOpenEditor(true);
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
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
      >
        <Button variant="contained" sx={{ p: 1 }} onClick={close}>
          <ArrowBackIcon />
        </Button>
        <ButtonGroup
          sx={{ gap: 1, "& .MuiButton-root": { p: 1, borderRadius: 1 } }}
        >
          <Button variant="contained">
            <PieChartIcon />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </Button>
        </ButtonGroup>
      </DialogTitle>
      <Box sx={{ height: "100%" }}>
        {/* {roundEnds.map((end, index) => (
          <MenuItem
            key={`end_${index}`}
            onClick={() => editEnd(end)}
            sx={{ border: "1px solid #ccc" }}
          >
            {end.id}
          </MenuItem>
        ))}
        {roundEnds.length < round.endCount && (
          <Button
            variant="contained"
            sx={{
              position: "absolute",
              bottom: 20,
              right: 20,
              p: 1,
              borderRadius: "50%",
            }}
            onClick={() => setOpenEditor(true)}
          >
            <AddIcon />
          </Button>
        )} */}
      </Box>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={editRound}>라운드 수정</MenuItem>
        <MenuItem onClick={deleteRound}>라운드 삭제</MenuItem>
      </Menu>
      {editTarget && (
        <RoundCreate
          sheet={sheet}
          close={() => setEditTarget(null)}
          setRound={setRound}
          editTarget={editTarget}
        />
      )}
      <Dialog open={openEditor} onClose={() => setOpenEditor(false)} fullWidth>
        <ScoreEditor round={round} end={currentEnd} addEnd={addEnd} />
      </Dialog>
    </Box>
  );
};

export default RoundView;

const ScoreEditor = ({ round, end, addEnd }) => {
  const [scores, setScores] = useState(Array(round.arrowCount).fill(null));

  const applyEnd = () => {
    setScores(end.data);
  };
  const writeScore = (button) => {
    let hasEmpty;
    switch (button) {
      case "X":
        hasEmpty = scores.some((score) => score === null);
        if (hasEmpty) {
          const lastScoreIndex = scores.indexOf(null);
          if (lastScoreIndex !== -1) {
            setScores((state) => {
              const temp = [...state];
              temp[lastScoreIndex] = "X";
              return temp;
            });
          }
        }
        break;
      case "M":
        hasEmpty = scores.some((score) => score === null);
        if (hasEmpty) {
          const lastScoreIndex = scores.indexOf(null);
          if (lastScoreIndex !== -1) {
            setScores((state) => {
              const temp = [...state];
              temp[lastScoreIndex] = "M";
              return temp;
            });
          }
        }
        break;
      case "ERASE":
        const lastScoreIndex =
          scores.indexOf(null) === -1 ? scores.length : scores.indexOf(null);
        if (lastScoreIndex === 0 || lastScoreIndex === -1) return;
        setScores((state) => {
          const temp = [...state];
          temp[lastScoreIndex - 1] = null;
          return temp;
        });
        break;
      case "SAVE":
        addEnd(scores);
        break;
      default:
        hasEmpty = scores.some((score) => score === null);
        if (hasEmpty) {
          const lastScoreIndex = scores.indexOf(null);
          if (lastScoreIndex !== -1) {
            setScores((state) => {
              const temp = [...state];
              temp[lastScoreIndex] = button;
              return temp;
            });
          }
        }
    }
  };
  useEffect(() => {
    if (end) applyEnd();
  }, []);
  return (
    <Box>
      <Grid container gap={1} sx={{ padding: 1 }}>
        {scores.map((score, index) => (
          <Grid
            item
            key={`score_${index}`}
            sx={{
              width: "calc((100% - 16px) / 3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              fontSize: 24,
              color: "#fff",
              fontWeight: "bold",
              bgcolor: SCORE_COLOR[score],
              border: "2px solid #ccc",
              borderRadius: 2,
            }}
          >
            {score}
          </Grid>
        ))}
      </Grid>
      <Divider />
      <TableContainer>
        <Table sx={{ borderSpacing: 4, borderCollapse: "separate" }}>
          <TableBody>
            {ButtonPad.map((row, rowIndex) => (
              <TableRow key={`row_${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    sx={{
                      position: "relative",
                      width: "25%",
                      textAlign: "center",
                      p: 0,
                      height: 40,
                    }}
                    key={`cell_${cellIndex}`}
                    rowSpan={cell === "SAVE" ? 3 : 1}
                  >
                    <Button
                      onClick={() => writeScore(cell)}
                      fullWidth
                      variant="contained"
                      sx={{
                        "&.MuiButton-root": {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          p: 1,
                          height: "100%",
                          fontSize: 18,
                        },
                      }}
                    >
                      {cell}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
