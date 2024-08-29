import { Button } from "@mui/material";
import { requestFetch, sendConsoleLog } from "App";

const GoogleLoginView = () => {
  const onSuccess = (res) => {
    sendConsoleLog("LOGIN SUCCESSED: ", JSON.stringify(res));
  };
  return (
    <Button onClick={() => requestFetch("login", { platform: "google" })}>
      구글 로그인
    </Button>
  );
};
export default GoogleLoginView;
