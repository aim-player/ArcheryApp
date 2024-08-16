import { Box, Button } from "@mui/material";
// import { useAppData } from "utils/context";

const View = () => {
  // const [appData] = useAppData();
  const resetAppData = () => {
    if (window.confirm("앱 데이터를 초기화할까요?")) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "reset", data: {} })
      );
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load" }));
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
    </div>
  );
};
export default View;
