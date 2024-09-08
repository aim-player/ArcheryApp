import { Box, Button } from "@mui/material";
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
    <div>
      {/* <Box>
        <span>앱 데이터 크기</span>
        <span>{appData.fileSize ? appData.fileSize + "bytes" : "0bytes"}</span>
        <Button variant="contained" onClick={resetAppData}>
          초기화
        </Button>
      </Box> */}
      <Button variant="contained" onClick={handleLogOut}>
        로그아웃
      </Button>
    </div>
  );
};
export default View;
