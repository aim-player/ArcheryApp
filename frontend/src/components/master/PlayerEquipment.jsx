import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useAlert, useUser } from "utils/context";
import { URL } from "constants/url";
import { useEffect, useState } from "react";
// import data from "../../constants/equipments.json";

import CloseIcon from "@mui/icons-material/Close";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { requestGet, requestPost } from "utils/fetch";

const Menu = {
  BOW: "bow",
  ARROW: "arrow",
};
const Types = {
  bow: [
    { name: "핸들", type: "handle" },
    { name: "날개", type: "wing" },
    { name: "조준기", type: "sight" },
    { name: "스태빌라이저", type: "stabilizer" },
    { name: "쿠션", type: "cushion" },
    { name: "현사", type: "string" },
  ],
  arrow: [
    { name: "샤프트", type: "shaft" },
    { name: "포인트", type: "point" },
    { name: "노크", type: "knock" },
    { name: "깃", type: "feather" },
    { name: "핀", type: "pin" },
  ],
};
const PlayerEquipment = () => {
  const [user] = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [, setAlert] = useAlert();
  const [editTarget, setEditTarget] = useState();
  const [formState, setFormState] = useState({ name: "", brand: "" });

  const [equipments, setEquipments] = useState({
    bow_handle: { name: "", brand: "" },
    bow_wing: { name: "", brand: "" },
    bow_sight: { name: "", brand: "" },
    bow_stabilizer: { name: "", brand: "" },
    bow_cushion: { name: "", brand: "" },
    bow_string: { name: "", brand: "" },
    arrow_shaft: { name: "", brand: "" },
    arrow_feather: { name: "", brand: "" },
    arrow_knock: { name: "", brand: "" },
    arrow_point: { name: "", brand: "" },
    arrow_pin: { name: "", brand: "" },
  });

  const [tab, setTab] = useState(Menu.BOW);
  const getPlayerEquipment = async () => {
    if (!location.state || !location.state.player_id)
      return setAlert({
        active: true,
        message: "잘못된 접근입니다.",
        callbackFn: () => navigate("/"),
      });
    const player_id = location.state.player_id;
    const requestOptions = {
      params: { player_id },
    };
    const response = await requestGet(URL.GET_PLAYER_EQUIPMENT, requestOptions);
    if (response.status === 200) {
      const { equipment } = response.data;
      if (equipment) {
        const value = {};
        for (const part in equipment) {
          equipment[part] && (value[part] = equipment[part]);
        }
        setEquipments((state) => ({ ...state, ...value }));
      }
    }
  };
  const save = async () => {
    const requestOptions = {
      data: {
        part: `${tab}_${editTarget.type}`,
        value: JSON.stringify(formState),
        player_id: location.state.player_id,
      },
    };
    const response = await requestPost(
      URL.UPDATE_PLAYER_EQUIPMENT,
      requestOptions
    );
    if (response.status === 200) {
      getPlayerEquipment();
      setEditTarget(null);
    }
  };
  useEffect(() => {
    getPlayerEquipment();
  }, []);

  useEffect(() => {
    if (editTarget) setFormState(equipments[`${tab}_${editTarget.type}`]);
    else setFormState({ name: "", brand: "" });
  }, [editTarget]);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
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
        <Typography sx={{ fontSize: 18 }}>장비 설정</Typography>
        <Button
          sx={{ p: 1 }}
          onClick={() => navigate(user.role === 1 ? URL.HOME : URL.TEAM)}
        >
          <CloseIcon />
        </Button>
      </Box>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="활" value={Menu.BOW} />
        <Tab label="화살" value={Menu.ARROW} />
      </Tabs>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 1,
          overflowY: "auto",
        }}
      >
        {tab === Menu.BOW && (
          <>
            {Types.bow.map((part, i) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid #eee",
                  py: 1.5,
                }}
                key={part.type}
              >
                <Box sx={{ width: 120 }}>{part.name}</Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    gap: 1,
                    overflow: "hidden",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        fontSize: 14,
                      }}
                    >
                      브랜드명: {equipments[`bow_${part.type}`].brand}
                    </Box>
                    <Box
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        fontSize: 14,
                      }}
                    >
                      제품명: {equipments[`bow_${part.type}`].name}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="inherit"
                      sx={{ p: 0.5 }}
                      onClick={() => setEditTarget(part)}
                    >
                      <BorderColorIcon />
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </>
        )}
        {tab === Menu.ARROW && (
          <>
            {Types.arrow.map((part, i) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid #eee",
                  py: 1.5,
                }}
                key={part.type}
              >
                <Box sx={{ fontWeight: "bold", width: 120 }}>{part.name}</Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    gap: 1,
                    overflow: "hidden",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        fontSize: 14,
                      }}
                    >
                      브랜드명: {equipments[`arrow_${part.type}`].brand}
                    </Box>
                    <Box
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        fontSize: 14,
                      }}
                    >
                      제품명: {equipments[`arrow_${part.type}`].name}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ p: 0.5 }}
                      onClick={() => setEditTarget(part)}
                    >
                      <BorderColorIcon />
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </>
        )}
      </Box>
      {editTarget && (
        <Dialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          fullWidth
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box>{editTarget.name} 설정</Box>
            <Button
              variant="contained"
              sx={{ p: 0.5 }}
              onClick={() => setEditTarget(null)}
            >
              <CloseIcon />
            </Button>
          </DialogTitle>
          <Divider />
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControlLabel
              labelPlacement="start"
              label="브랜드명"
              value={formState.brand}
              onChange={(e) =>
                setFormState((state) => ({ ...state, brand: e.target.value }))
              }
              control={<TextField />}
              sx={{
                display: "flex",
                gap: 1,
                width: "100%",
                justifyContent: "flex-end",
                "& .MuiInputBase-root ": { p: 1 },
                "& .MuiFormControl-root": { flex: 1 },
                "&.MuiFormControlLabel-root": { margin: 0 },
                "& .MuiFormControlLabel-label": {
                  width: 60,
                  fontSize: 14,
                },
              }}
            />
            <FormControlLabel
              labelPlacement="start"
              label="제품명"
              value={formState.name}
              onChange={(e) =>
                setFormState((state) => ({ ...state, name: e.target.value }))
              }
              control={<TextField />}
              sx={{
                display: "flex",
                gap: 1,
                width: "100%",
                justifyContent: "flex-end",
                "& .MuiInputBase-root ": { p: 1 },
                "& .MuiFormControl-root": { flex: 1 },
                "&.MuiFormControlLabel-root": { margin: 0 },
                "& .MuiFormControlLabel-label": {
                  width: 60,
                  fontSize: 14,
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ p: 0.5 }}
              onClick={save}
            >
              저장
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};
export default PlayerEquipment;
