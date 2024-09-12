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
import { requestGet, requestPost } from "utils/fetch";
import { useEffect, useState } from "react";
import { URL } from "constants/url";
import { useNavigate } from "react-router-dom";

const ProfileInitializer = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ role: 1, name: "" });
  const [formState, setFormState] = useState({
    name: { error: false, helperText: "" },
  });
  const [, setConfirm] = useConfirm();
  const [user, setUser] = useUser();
  const logOut = async () => {
    if (!user) return navigate("/");
    const response = await requestGet(URL.LOGOUT);
    if (response.status === 200) {
      if (user.platform === "google") {
        if (window.ReactNativeWebView)
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "signout",
              payload: { platform: user.platform },
            })
          );
      }
      setUser(null);
    }
    navigate("/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    const requestOptions = {
      data: inputs,
    };
    const response = await requestPost(URL.ADD_PROFILE, requestOptions);
    if (response.status === 200) {
      setUser((state) => ({ ...state, ...response.data }));
      navigate("/");
    }
  };
  useEffect(() => {
    setInputs((state) => ({ ...state, name: "" }));
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
