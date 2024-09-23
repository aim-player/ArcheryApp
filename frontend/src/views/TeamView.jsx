import {
  Box,
  Button,
  Dialog,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { requestGet, requestPost } from "utils/fetch";
import { useAlert, useConfirm, useUser } from "utils/context";
import { useEffect, useState } from "react";
import { URL } from "constants/url";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DraftsIcon from "@mui/icons-material/Drafts";
import ConstructionIcon from "@mui/icons-material/Construction";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useNavigate } from "react-router-dom";

const TeamView = () => {
  const navigate = useNavigate();
  const [, setConfirm] = useConfirm();
  const [user, setUser] = useUser();
  const [team, setTeam] = useState();
  const [members, setMembers] = useState({
    admin: null,
    masters: [],
    players: [],
  });
  const [, setAlert] = useAlert();
  const [formState, setFormState] = useState({ name: "", description: "" });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [openFindDialog, setOpenFindDialog] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [findResult, setFindResult] = useState([]);
  const [findState, setFindState] = useState("");

  const getUser = async () => {
    const response = await requestGet(URL.GET_PROFILE);
    if (response.status === 200) {
      setOpenCreateDialog(false);
      const { user } = response.data;
      setUser(user);
    }
  };
  const getTeam = async () => {
    if (!user || !user.team_id) return;
    const response = await requestGet(URL.GET_TEAM);
    if (response.status === 200) {
      const { team, members } = response.data;
      setTeam(team);

      const admin = members.find((member) => member.id === team.owner_id);
      const masters = members.filter(
        (member) => member.role === 2 && member.id !== team.owner_id
      );
      const players = members.filter(
        (member) => member.role === 1 && member.id !== team.owner_id
      );
      setMembers({ admin, masters, players });
    }
  };

  const createTeam = async () => {
    if (formState.name.length === 0)
      return setAlert({ active: true, message: "팀 이름을 입력해주세요." });
    const requestOptions = {
      data: formState,
    };

    const response = await requestPost(URL.CREATE_TEAM, requestOptions);
    if (response.status === 200) {
      getTeam();
      const response = await requestGet(URL.GET_PROFILE);
      if (response.status === 200) await getUser();
    }
  };

  const sendInvitation = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: "Hello World",
        url: "https://developer.mozilla.org",
      });
    } else {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "invite",
          payload: { name: team.name, team_id: team.team_id },
        })
      );
    }
  };

  const findPlayer = async () => {
    if (findState.length === 0) return;
    const requestOptions = {
      params: { name: findState },
    };
    const response = await requestPost(URL.FIND_PLAYER, requestOptions);
    if (response.status === 200) {
      const { players } = response.data;
      setFindResult(players);
    }
  };

  const invitePlayer = async (user_id) => {
    const requestOptions = {
      data: { team_id: team.team_id, user_id, team_name: team.name },
    };
    const response = await requestPost(URL.INVITE_TEAM, requestOptions);
    if (response.status === 200) {
      setAlert({ active: true, message: "초대를 완료했어요." });
    }
  };

  const getTeamInvitations = async () => {
    const requestOptions = {
      params: { team_id: team.team_id },
    };
    const response = await requestGet(URL.GET_TEAM_INVITATIONS, requestOptions);
    if (response.status === 200) {
      const { invitations } = response.data;
      setInvitations(invitations);
    }
  };

  useEffect(() => {
    getUser();
    getTeam();
  }, []);

  useEffect(() => {
    if (openFindDialog) getTeamInvitations();
  }, [openFindDialog]);

  return (
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="h5">
          <Box sx={{ p: 1 }}>팀 관리 {team && `[ ${team.name} ]`}</Box>
        </Typography>
      </Box>
      <Box>
        {user && user.team_id ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 1,
                fontWeight: 500,
                fontSize: 18,
                borderBottom: "1px solid #333",
              }}
            >
              <Box>선수 명단</Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => setOpenFindDialog(true)}
                  sx={{ fontSize: 12, p: 0.5 }}
                >
                  <SearchIcon />
                </Button>
                <Button
                  variant="contained"
                  onClick={sendInvitation}
                  sx={{ fontSize: 12, p: 0.5 }}
                >
                  <DraftsIcon />
                </Button>
              </Box>
            </Box>
            <Box>
              {members.players.length > 0 ? (
                members.players.map((p, i) => (
                  <Box
                    key={`player_${i}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      border: "1px solid #eee",
                    }}
                  >
                    <Box sx={{ fontSize: 18 }}>{p.name}</Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        sx={{ p: 1 }}
                        onClick={() =>
                          navigate(URL.PLAYER_EQUIPMENT, {
                            state: { player_id: p.id },
                          })
                        }
                      >
                        <ConstructionIcon />
                      </Button>
                      <Button variant="contained" sx={{ p: 1 }}>
                        <TimelineIcon />
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 1 }}>
                  <Box></Box>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              p: 2,
              height: "100%",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              아직 관리중인 팀이 없어요.
              <br />
              아래 버튼을 눌러 팀을 생성해 보세요!
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={{ p: 1 }}
              onClick={() => setOpenCreateDialog(true)}
            >
              팀 만들기
            </Button>
          </Box>
        )}
        <Dialog open={openCreateDialog} fullScreen>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 1,
                borderBottom: "2px solid #000",
              }}
            >
              <Typography variant="h5">팀 생성</Typography>
            </Box>
            <Box sx={{ flex: 1, p: 1 }}>
              <Box>
                <Typography>팀 이름</Typography>
                <TextField
                  fullWidth
                  sx={{ "& .MuiInputBase-root": { p: 1 } }}
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((state) => ({
                      ...state,
                      name: e.target.value,
                    }))
                  }
                />
              </Box>
              <Box>
                <Typography>인사말</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  sx={{ "& .MuiInputBase-root": { p: 1 } }}
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((state) => ({
                      ...state,
                      description: e.target.value,
                    }))
                  }
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, p: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setOpenCreateDialog(false)}
                sx={{ p: 1 }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{ p: 1 }}
                onClick={createTeam}
              >
                생성
              </Button>
            </Box>
          </Box>
        </Dialog>

        <Dialog open={openFindDialog} fullScreen>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 1,
                borderBottom: "2px solid #000",
              }}
            >
              <Typography variant="h5">선수 검색</Typography>
              <Button
                variant="contained"
                sx={{ p: 1 }}
                onClick={() => setOpenFindDialog(false)}
              >
                <CloseIcon />
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 1,
              }}
            >
              <TextField
                value={findState}
                onChange={(e) => setFindState(e.target.value)}
                fullWidth
                sx={{ "& .MuiInputBase-root": { p: 1 } }}
                placeholder="선수 이름"
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ p: 1 }}
                onClick={findPlayer}
              >
                검색
              </Button>
            </Box>
            <Divider />
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 1,
                overflowY: "auto",
              }}
            >
              {findResult.length > 0 ? (
                findResult.map((p, i) => (
                  <MenuItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #eee",
                      p: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box>{p.name}</Box>
                      {p.team_name && <Box>{p.team_name}</Box>}
                    </Box>
                    {!p.team_name &&
                      (invitations.find((n) => n.player_id === p.id) ? (
                        <Button>초대 취소</Button>
                      ) : (
                        <Button
                          sx={{ p: 0.5 }}
                          variant="contained"
                          onClick={() =>
                            setConfirm({
                              active: true,
                              message: "이 선수를 팀에 초대할까요?",
                              callbackFn: () => invitePlayer(p.id),
                            })
                          }
                        >
                          초대하기
                        </Button>
                      ))}
                  </MenuItem>
                ))
              ) : (
                <Box>검색결과가 없습니다</Box>
              )}
            </Box>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};
export default TeamView;
