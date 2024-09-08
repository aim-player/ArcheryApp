import { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { requestGet, requestPost } from "utils/fetch";
import { URL } from "constants/url";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ko";
import { useUser } from "utils/context";
import dayjs from "dayjs";
const View = ({ close }) => {
  const [user] = useUser();
  const [currentProfile, setCurrentProfile] = useState({
    name: "",
    team: "",
    birth: "",
    gender: "",
    country: "",
    image_url: "",
    visible: 0,
  });
  const [inputs, setInputs] = useState({
    team: "",
    birth: "",
    gender: "",
    country: "",
    image_url: "",
    visible: 0,
  });
  const getPlayerProfile = async () => {
    const response = await requestGet(URL.GET_PLAYER_PROFILE);
    let profile = {
      name: user.name,
    };
    if (response.status === 200) {
      const { player_profile } = response.data;
      if (player_profile) {
        profile = { ...profile, ...player_profile };
      }
    }
    setInputs((state) => ({ ...state, ...profile }));
    setCurrentProfile((state) => ({ ...state, ...profile }));
  };
  const handleClose = () => {
    let hasDiff = false;
    for (let key in currentProfile) {
      if (currentProfile[key] !== inputs[key]) hasDiff = true;
    }
    if (
      hasDiff &&
      !window.confirm("저장하지 않은 변경사항이 있어요.\n계속 진행할까요?")
    )
      return;
    close();
  };
  const validateForm = () => {
    let hasDiff = false;
    for (let key in currentProfile) {
      if (currentProfile[key] !== inputs[key]) hasDiff = true;
    }
    return hasDiff;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const { name, ...rest } = inputs;
    const requestOptions = {
      data: rest,
    };
    const response = await requestPost(
      URL.UPDATE_PLAYER_PROFILE,
      requestOptions
    );
    if (response.status === 200) {
      alert("프로필을 저장했어요.");
      close();
    }
  };
  useEffect(() => {
    getPlayerProfile();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="body">프로필 설정</Typography>
      </DialogTitle>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            p: 2,
            gap: 2,
          }}
        >
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {inputs.image_url ? (
              <img
                width={128}
                height={128}
                alt="profile_image"
                src={inputs.image_url}
              />
            ) : (
              <Avatar sx={{ width: 128, height: 128 }} />
            )}
            <Button variant="contained" sx={{ px: 2, py: 1 }}>
              사진 선택
            </Button>
          </Box> */}
          <Box sx={{ flex: 1 }}>
            <Grid container sx={{ gap: 1 }}>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                item
                xs={12}
              >
                <Grid item xs={4}>
                  소속팀
                </Grid>
                <Box sx={{ width: "100%", p: 1 }}>
                  {user.team_id ? user.team_id : "무소속"}
                </Box>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                item
                xs={12}
              >
                <Grid item xs={4}>
                  이름
                </Grid>
                <TextField
                  placeholder="이름"
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs((state) => ({ ...state, name: e.target.value }))
                  }
                  fullWidth
                  sx={{ "& .MuiInputBase-root": { p: 1 } }}
                />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                item
                xs={12}
              >
                <Grid item xs={4}>
                  생년월일
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={inputs.birth ? dayjs(inputs.birth) : null}
                    format="YYYY/MM/DD"
                    adapterLocale="ko"
                    onChange={(e) =>
                      e &&
                      setInputs((state) => ({
                        ...state,
                        birth: e.format("YYYY/MM/DD"),
                      }))
                    }
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { p: 1 },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                item
                xs={12}
              >
                <Grid item xs={4}>
                  성별
                </Grid>
                <RadioGroup
                  row
                  sx={{ width: "100%" }}
                  value={inputs.gender}
                  onChange={(e) => {
                    console.log("===: ", e.target.value, inputs.gender);
                    setInputs((state) => ({
                      ...state,
                      gender: Number(e.target.value),
                    }));
                  }}
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="남자"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="여자"
                  />
                </RadioGroup>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                item
                xs={12}
              >
                <Grid item xs={4}>
                  지역
                </Grid>
                <TextField
                  value={inputs.country}
                  onChange={(e) =>
                    setInputs((state) => ({
                      ...state,
                      country: e.target.value,
                    }))
                  }
                  fullWidth
                  sx={{ "& .MuiInputBase-root": { p: 1 } }}
                />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                item
                xs={12}
              >
                <Grid item xs={4}>
                  프로필 공개
                </Grid>
                <RadioGroup
                  row
                  sx={{ width: "100%" }}
                  value={inputs.visible}
                  onChange={(e) =>
                    setInputs((state) => ({
                      ...state,
                      visible: Number(e.target.value),
                    }))
                  }
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="공개"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="비공개"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", p: 1, gap: 1, borderTop: "1px solid #ccc" }}>
        <Button
          fullWidth
          sx={{ p: 1 }}
          variant="outlined"
          onClick={handleClose}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          fullWidth
          sx={{ p: 1 }}
          variant="contained"
        >
          저장
        </Button>
      </Box>
    </Box>
  );
};
export default View;
