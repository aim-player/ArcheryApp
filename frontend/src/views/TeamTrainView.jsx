import {
  Box,
  Button,
  Dialog,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { URL } from "constants/url";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "utils/context";
import { requestGet, requestPost } from "utils/fetch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { ScoreEditor } from "./TrainView";
const TeamTrainView = () => {
  const [, setAlert] = useAlert();
  const location = useLocation();
  const navigate = useNavigate();

  const [train, setTrain] = useState();
  const [team, setTeam] = useState();
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState();
  const getTeamTrain = async () => {
    if (!location?.state?.train)
      return setAlert({
        active: true,
        message: "잘못된 접근입니다.",
        callbackFn: () => navigate("/"),
      });
    const requestOptions = {
      params: {
        team_id: location.state.team_id,
        create_time: location.state.train.create_time,
      },
    };
    const response = await requestGet(URL.GET_TEAM_TRAIN, requestOptions);
    if (response.status === 200) {
      const { players } = response.data;
      setPlayers(
        players.map((player) => ({
          train_id: player.train_id,
          name: player.name,
          user_id: player.user_id,
        }))
      );
    }
    setTrain(location.state.train);
  };
  const getTeam = async () => {
    const response = await requestGet(URL.GET_TEAM, {
      params: { team_id: location.state.team_id },
    });
    if (response.status === 200) {
      const { team } = response.data;
      setTeam(team);
    }
  };
  useEffect(() => {
    getTeamTrain();
    getTeam();
  }, []);

  useEffect(() => {
    if (!team || players.length === 0) return;
    setPlayer(players[0]);
  }, [players, team]);
  return (
    <Box
      sx={{
        position: "relative",
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
          p: 1,
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Button
          variant="contained"
          sx={{ p: 1 }}
          onClick={() => navigate(URL.TEAM_TRAINS)}
        >
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">팀 훈련</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        {players.map((p, i) => (
          <Box
            onClick={() => setPlayer(p)}
            sx={{
              p: 1,
              bgcolor:
                player && player.user_id === p.user_id ? "#eee" : "transparent",
            }}
            key={`player_${i}`}
          >
            {p.name}
          </Box>
        ))}
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {player ? (
          <TeamTrainEnds
            train={train}
            train_id={player.train_id}
            user_id={player.user_id}
            player={player}
          />
        ) : (
          <Box>데이터 로딩중...</Box>
        )}
      </Box>
    </Box>
  );
};

export default TeamTrainView;

const TeamTrainEnds = ({ train, train_id, player }) => {
  const [trainEnds, setTrainEnds] = useState([]);
  const [anchorEl, setAnchorEl] = useState();
  const [currentEnd, setCurrentEnd] = useState();
  const [editTarget, setEditTarget] = useState();
  const [openEditor, setOpenEditor] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  const editRound = () => {
    setEditTarget(train);
    setAnchorEl(null);
  };
  const addEnd = async (scores) => {
    if (!currentEnd && trainEnds.length >= train.end_count) return;

    const requestOptions = {
      data: { train_id, player_id: player.user_id, scores },
    };

    const response = await requestPost(URL.ADD_TEAM_END, requestOptions);
    if (response.status === 200) {
      setCurrentEnd(null);
      setOpenEditor(false);
      getEnds();
    }
  };
  const editEnd = async (scores) => {
    const requestOptions = {
      data: {
        train_id,
        player_id: player.user_id,
        end_id: currentEnd.id,
        scores,
      },
    };
    const response = await requestPost(URL.UPDATE_TEAM_END, requestOptions);
    if (response.status === 200) {
      setCurrentEnd(null);
      setOpenEditor(false);
      getEnds();
    }
  };

  const getEnds = async () => {
    const requestOptions = {
      params: { train_id, player_id: player.user_id },
    };
    const response = await requestGet(URL.GET_TEAM_ENDS, requestOptions);
    if (response.status === 200) {
      const { ends } = response.data;
      if (ends) setTrainEnds(ends);
    }
  };
  useEffect(() => {
    if (!train || !player) return;
    getEnds();
  }, [train, player]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ height: "100%", overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 1,
            overflowY: "auto",
          }}
        >
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
        {/* <MenuItem onClick={deleteRound}>라운드 삭제</MenuItem> */}
      </Menu>
      {/* {editTarget && (
        <TrainCreate
          // sheet={sheet}
          close={() => setEditTarget(null)}
          // setRound={setRound}
          editTarget={editTarget}
        />
      )} */}
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
        {/* <TrainStats train={train} close={() => setOpenStats(false)} /> */}
      </Dialog>
    </Box>
  );
};
