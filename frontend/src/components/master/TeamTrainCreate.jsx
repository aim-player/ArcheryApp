import {
  Box,
  Button,
  Checkbox,
  List,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { requestGet, requestPost } from "utils/fetch";
import { useAlert, useUser } from "utils/context";
import { URL } from "constants/url";
import { ARROW_COUNT, DISTANCE, END_COUNT } from "constants/rule";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaceSelector from "components/train/PlaceSelector";
const TeamTrainCreate = () => {
  const [user] = useUser();
  const [, setAlert] = useAlert();
  const [team, setTeam] = useState();
  const [openPlaceDialog, setOpenPlaceDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [inputs, setInputs] = useState({
    distance: DISTANCE[3],
    arrowCount: ARROW_COUNT[1],
    endCount: END_COUNT[5],
    place: "",
  });
  const navigate = useNavigate();
  const getTeam = async () => {
    if (!user || !user.team_id)
      return setAlert({
        active: true,
        message: "팀을 생성해주세요.",
        callbackFn: () => navigate("/"),
      });
    const response = await requestGet(URL.GET_TEAM);
    if (response.status === 200) {
      const { team, members } = response.data;
      setTeam(team);
      const players = members.filter(
        (member) => member.role === 1 && member.id !== team.owner_id
      );
      setMembers(players);
    }
  };
  const addTeamTrain = async () => {
    const requestOptions = {
      data: { team_id: team.team_id, players: selectedMembers, ...inputs },
    };
    const response = await requestPost(URL.ADD_TEAM_TRAIN, requestOptions);
    if (response.status === 200) {
      const { train } = response.data;
      navigate(URL.TEAM_TRAIN, {
        state: { team_id: team.team_id, train },
      });
    }
  };
  useEffect(() => {
    getTeam();
  }, []);
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
          p: 1,
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Button sx={{ p: 1 }} onClick={() => navigate(URL.TRAINS)}>
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">팀 훈련 추가</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1,
        }}
      >
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
      <Box sx={{ px: 1 }}>선수 선택</Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
          overflowY: "auto",
          p: 1,
        }}
      >
        {members.map((member, i) => (
          <MenuItem
            onClick={() => {
              const checked = selectedMembers.indexOf(member.id) === -1;
              if (checked) setSelectedMembers([...selectedMembers, member.id]);
              else
                setSelectedMembers(
                  selectedMembers.filter((id) => id !== member.id)
                );
            }}
            sx={{
              p: 0,
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
            }}
            key={`member_${i}`}
          >
            <Checkbox
              readOnly
              checked={selectedMembers.indexOf(member.id) !== -1}
            />
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.5 }}>
              {member.name}
              <Box sx={{ fontSize: 12, color: "#666" }}>
                #{member.id.slice(0, 4)}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Box>
      <Box sx={{ p: 1 }}>
        <Button
          disabled={selectedMembers.length === 0}
          fullWidth
          variant="contained"
          sx={{ p: 1 }}
          onClick={addTeamTrain}
        >
          훈련시작
        </Button>
      </Box>
    </Box>
  );
};

export default TeamTrainCreate;
