import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useConfirm, useUser } from "utils/context";
import { addProfile, requestLogOut } from "utils/fetch";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProfileInitializer = () => {
  const [inputs, setInputs] = useState({ role: 1, name: "", teamName: "" });
  const [formState, setFormState] = useState({
    name: { error: false, helperText: "" },
    teamName: { error: false, helperText: "" },
  });
  const [, setConfirm] = useConfirm();
  const [, setUser] = useUser();
  const navigate = useNavigate();
  const logOut = () => {
    requestLogOut();
    setUser(null);
    navigate("/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.role === 2 && inputs.teamName === "") {
      setFormState((state) => ({
        ...state,
        teamName: {
          ...state.teamName,
          error: true,
          helperText: "필수 입력 항목입니다.",
        },
      }));
      return;
    }
    if (inputs.name === "") {
      setFormState((state) => ({
        ...state,
        name: {
          ...state.name,
          error: true,
          helperText: "필수 입력 항목입니다.",
        },
      }));
      return;
    }
    const data = await addProfile(inputs);
    setUser((state) => ({ ...state, ...data }));
  };
  useEffect(() => {
    setInputs((state) => ({ ...state, name: "", teamName: "" }));
  }, [inputs.role]);
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
          정보 입력
        </Typography>
        <Button
          variant="contained"
          sx={{
            p: 1,
          }}
          onClick={() =>
            setConfirm({
              active: true,
              message: "로그아웃 할까요?",
              callbackFn: logOut,
            })
          }
        >
          <LogoutIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "12px 0",
          }}
        >
          <RadioGroup
            value={inputs.role}
            onChange={(e) =>
              setInputs((state) => ({ ...state, role: Number(e.target.value) }))
            }
            defaultValue={1}
            row
            sx={{ border1: "2px solid red" }}
          >
            <FormControlLabel label="선수" control={<Radio />} value={1} />
            <FormControlLabel label="마스터" control={<Radio />} value={2} />
          </RadioGroup>
          {inputs.role === 2 && (
            <TextField
              value={inputs.teamName}
              error={formState.teamName.error}
              helperText={formState.teamName.helperText}
              onChange={(e) => {
                setInputs((state) => ({ ...state, teamName: e.target.value }));
                setFormState((state) => ({
                  ...state,
                  teamName: {
                    error: false,
                    helperText: "",
                  },
                }));
              }}
              fullWidth
              placeholder="팀 이름"
              sx={{ "& .MuiInputBase-root": { p: 1 } }}
            />
          )}
          <TextField
            value={inputs.name}
            error={formState.name.error}
            helperText={formState.name.helperText}
            onChange={(e) => {
              setInputs((state) => ({ ...state, name: e.target.value }));
              setFormState((state) => ({
                ...state,
                name: {
                  error: false,
                  helperText: "",
                },
              }));
            }}
            fullWidth
            placeholder="이름"
            sx={{ "& .MuiInputBase-root": { p: 1 } }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ p: 1 }}>
            저장하기
          </Button>
        </form>
      </DialogContent>
    </Box>
  );
};
export default ProfileInitializer;
