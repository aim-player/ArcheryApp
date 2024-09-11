import { Box, Button, Typography } from "@mui/material";
import { URL } from "constants/url";
import { useUser } from "utils/context";
import { requestGet } from "utils/fetch";
// import { useAppData } from "utils/context";

const View = () => {
  // const [appData] = useAppData();
  const [user, setUser] = useUser();
  const resetAppData = () => {
    if (window.confirm("앱 데이터를 초기화할까요?")) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "reset", data: {} })
      );
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load" }));
    }
  };
  const handleLogOut = async () => {
    if (!window.confirm("로그아웃 할까요?")) return;
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
      window.location.reload();
    }
  };
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #000",
            p: 1,
          }}
        >
          <Typography variant="h5">설정</Typography>
        </Box>
      </Box>
      {/* <Box>
        <span>앱 데이터 크기</span>
        <span>{appData.fileSize ? appData.fileSize + "bytes" : "0bytes"}</span>
        <Button variant="contained" onClick={resetAppData}>
          초기화
        </Button>
      </Box> */}
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogOut}
          sx={{ p: 1 }}
        >
          로그아웃
        </Button>
      </Box>
    </Box>
  );
};
export default View;
