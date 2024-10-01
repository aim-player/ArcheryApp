import { Box, Button, Typography } from "@mui/material";
import { URL } from "constants/url";
import { useConfirm, useUser } from "utils/context";
import { requestGet } from "utils/fetch";

const View = () => {
  const [, setConfirm] = useConfirm();
  const [user, setUser] = useUser();
  const handleLogOut = () => {
    setConfirm({
      active: true,
      message: "로그아웃 할까요?",
      callbackFn: async () => {
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
          window.location.href = "/";
        }
      },
    });
  };
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
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
      {user && (
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
      )}
    </Box>
  );
};
export default View;
