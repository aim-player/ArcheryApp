import { URL } from "constants/url";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "utils/context";
import { requestGet } from "utils/fetch";

const { Box, Typography, Button, Dialog } = require("@mui/material");

const GroupView = () => {
  const navigate = useNavigate();
  const [user] = useUser();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const getTeamInfo = async () => {
    if (!user || user.role === 1) return navigate("/");
    if (Boolean(user.team_id)) {
      const response = await requestGet(URL.GET_TEAM);
      if (response.status === 200) {
        console.log("Succeeded to get team: ", response.data);
      }
    }
  };
  useEffect(() => {
    getTeamInfo();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
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
        <Typography variant="h5">팀 관리</Typography>
      </Box>
      {user && user.team_id ? (
        <Box></Box>
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
          <Box sx={{ flex: 1, p: 1 }}></Box>
          <Box sx={{ display: "flex", gap: 1, p: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenCreateDialog(false)}
              sx={{ p: 1 }}
            >
              취소
            </Button>
            <Button variant="contained" fullWidth sx={{ p: 1 }}>
              생성
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
export default GroupView;
