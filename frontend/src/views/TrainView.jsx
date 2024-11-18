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
import TimelineIcon from "@mui/icons-material/Timeline";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import BackspaceIcon from "@mui/icons-material/Backspace";

import TrainCreate from "components/train/TrainCreate";
import { SCORE_COLOR } from "constants/rule";
import TrainStats from "components/train/TrainStats";
import { useAlert } from "utils/context";
import { requestGet, requestPost } from "utils/fetch";
import { URL } from "constants/url";
import { useLocation, useNavigate } from "react-router-dom";

const ButtonPad = [
  ["X", 10, "M", "ERASE"],
  [9, 8, 7, "SAVE"],
  [6, 5, 4],
  [3, 2, 1],
];

const TrainView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setAlert] = useAlert();
  const [train, setTrain] = useState({});
  const [trainEnds, setTrainEnds] = useState([]);
  const [anchorEl, setAnchorEl] = useState();
  const [editTarget, setEditTarget] = useState();
  const [currentEnd, setCurrentEnd] = useState();

  const [openEditor, setOpenEditor] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  const editRound = () => {
    setEditTarget(train);
    setAnchorEl(null);
  };
  const deleteRound = async () => {
    if (!window.confirm("이 훈련일지을 삭제할까요?")) return;
    const requestOptions = {
      data: { train_id: train.id },
    };
    const response = await requestPost(URL.DELETE_TRAIN, requestOptions);
    if (response.status === 200) {
      navigate(URL.TRAINS);
    }
  };
  const addEnd = async (scores) => {
    if (!currentEnd && trainEnds.length >= train.end_count) return;

    const requestOptions = {
      data: { train_id: train.id, scores },
    };

    const response = await requestPost(URL.ADD_END, requestOptions);
    if (response.status === 200) {
      setCurrentEnd(null);
      setOpenEditor(false);
      getEnds();
    }
  };
  const editEnd = async (scores) => {
    const requestOptions = {
      data: {
        train_id: train.id,
        end_id: currentEnd.id,
        scores,
      },
    };
    const response = await requestPost(URL.UPDATE_END, requestOptions);
    if (response.status === 200) {
      getEnds();
      setCurrentEnd(null);
      setOpenEditor(false);
    }
  };

  const getTrain = async () => {
    if (!location.state || !location.state.id) {
      setAlert({
        active: true,
        message: "훈련을 선택해주세요",
        callbackFn: () => navigate(URL.TRAINS),
      });
      return;
    }
    const requestOptions = {
      params: { train_id: location.state.id },
    };
    const response = await requestGet(URL.GET_TRAIN, requestOptions);
    if (response.status === 200) {
      const { train } = response.data;
      setTrain(train);
    }
  };

  const getEnds = async () => {
    if (!train || !train.id) return;
    const requestOptions = {
      params: { train_id: train.id },
    };
    const response = await requestGet(URL.GET_ENDS, requestOptions);
    if (response.status === 200) {
      const { ends } = response.data;
      if (ends) setTrainEnds(ends);
    }
  };

  useEffect(() => {
    getTrain();
  }, []);

  useEffect(() => {
    if (train) getEnds();
  }, [train]);
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
        <Button sx={{ p: 1 }} onClick={() => navigate(URL.TRAINS)}>
          <ArrowBackIcon />
        </Button>
        <ButtonGroup
          sx={{ gap: 1, "& .MuiButton-root": { p: 1, borderRadius: 1 } }}
        >
          <Button variant="contained" onClick={() => setOpenStats(true)}>
            <TimelineIcon />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </Button>
        </ButtonGroup>
      </DialogTitle>
      <Box sx={{ border: "1px solid #ccc", height: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
          {trainEnds &&
            trainEnds.map((end, endIndex) => (
              <MenuItem
                key={`end_${endIndex}`}
                onClick={() => {
                  setCurrentEnd(end);
                  setOpenEditor(true);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: (train.arrow_count / 3) * 50,
                  border: "1px solid #ccc",
                  padding: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                    border: "1px solid #ccc",
                    height: "100%",
                  }}
                >
                  E{endIndex + 1}
                </Box>
                {end.scores && (
                  <>
                    <Grid
                      container
                      sx={{ flex: 1, display: "flex", height: "100%" }}
                    >
                      {Array(train.arrow_count)
                        .fill(null)
                        .map((_, scoreIndex) => {
                          const scores = JSON.parse(end.scores);
                          return (
                            <Grid
                              item
                              xs={4}
                              key={`${endIndex}_${scoreIndex}`}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: "1px solid #ccc",
                                color: scores[scoreIndex]
                                  ? "#000"
                                  : "transparent",
                              }}
                            >
                              {scores[scoreIndex] ? scores[scoreIndex] : 0}
                            </Grid>
                          );
                        })}
                    </Grid>
                    <Grid
                      container
                      item
                      xs={2}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      {Array.from({
                        length: Math.ceil(train.arrow_count / 3),
                      }).map((_, index) => {
                        const sum = JSON.parse(end.scores)
                          .slice(index * 3, index * 3 + 3)
                          .reduce((acc, curr) => {
                            if (curr === "M") curr = 0;
                            else if (curr === "X") curr = 10;
                            return acc + curr;
                          }, 0);

                        return (
                          <Grid
                            item
                            key={`sum_${index}`}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flex: 1,
                              border: "1px solid #ccc",
                            }}
                          >
                            {sum}
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Grid
                      container
                      item
                      xs={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        border: "1px solid #ccc",
                      }}
                    >
                      {JSON.parse(end.scores).reduce((acc, curr) => {
                        if (curr === "M") curr = 0;
                        else if (curr === "X") curr = 10;
                        return acc + curr;
                      }, 0)}
                    </Grid>
                  </>
                )}
              </MenuItem>
            ))}
          {(!trainEnds || trainEnds.length < train.end_count) && (
            <MenuItem
              onClick={() => {
                setCurrentEnd(null);
                setOpenEditor(true);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                height: (train.arrow_count / 3) * 50,
                border: "1px solid #ccc",
                padding: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 2,
                  border: "1px solid #ccc",
                  height: "100%",
                  color: "transparent",
                }}
              >
                E0
              </Box>
              <Grid container sx={{ flex: 1, height: "100%" }}>
                {Array(train.arrow_count)
                  .fill(null)
                  .map((score, scoreIndex) => (
                    <Grid
                      item
                      xs={4}
                      key={`cell_${scoreIndex}`}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #ccc",
                      }}
                    >
                      {score}
                    </Grid>
                  ))}
              </Grid>
              <Grid
                container
                item
                xs={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {Array.from({
                  length: Math.ceil(train.arrow_count / 3),
                }).map((_, index) => {
                  return (
                    <Grid
                      key={`sum_${index}`}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        border: "1px solid #ccc",
                        padding: 1,
                      }}
                    ></Grid>
                  );
                })}
              </Grid>
              <Grid
                container
                item
                xs={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  border: "1px solid #ccc",
                }}
              ></Grid>
            </MenuItem>
          )}
        </Box>
        {(!trainEnds || trainEnds.length < train.end_count) && (
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
        )}
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
        <TrainCreate
          // sheet={sheet}
          close={() => setEditTarget(null)}
          // setRound={setRound}
          editTarget={editTarget}
        />
      )}
      <Dialog
        open={openEditor}
        onClose={() => {
          setOpenEditor(false);
          setCurrentEnd(null);
        }}
        sx={{
          "& .MuiPaper-root": { mt: "auto" },
        }}
        fullWidth
      >
        <ScoreEditor
          train={train}
          end={currentEnd}
          addEnd={addEnd}
          editEnd={editEnd}
        />
      </Dialog>
      <Dialog open={openStats} onClose={() => setOpenStats(false)} fullScreen>
        <TrainStats train={train} close={() => setOpenStats(false)} />
      </Dialog>
    </Box>
  );
};

export default TrainView;

export const ScoreEditor = ({ train, end, addEnd, editEnd }) => {
  const [scores, setScores] = useState(Array(train.arrow_count).fill(null));

  const applyEnd = () => {
    setScores(JSON.parse(end.scores));
  };
  const writeScore = (button) => {
    const convertScore = (score) => {
      if (score === "X") return 11;
      if (score === "M") return 0;
      return score;
    };
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
              temp.sort((a, b) => convertScore(b) - convertScore(a));
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
              temp.sort((a, b) => convertScore(b) - convertScore(a));
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
        if (end) editEnd(scores);
        else addEnd(scores);
        break;
      default:
        hasEmpty = scores.some((score) => score === null);
        if (hasEmpty) {
          const lastScoreIndex = scores.indexOf(null);
          if (lastScoreIndex !== -1) {
            setScores((state) => {
              const temp = [...state];
              temp[lastScoreIndex] = button;
              temp.sort((a, b) => convertScore(b) - convertScore(a));
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
                      height: 60,
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
                      {cell === "SAVE" ? (
                        <KeyboardReturnIcon />
                      ) : cell === "ERASE" ? (
                        <BackspaceIcon />
                      ) : (
                        cell
                      )}
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
