import "./App.css";
import { CssBaseline, Container, ThemeProvider } from "@mui/material";
import MainView from "./views/MainView";
import theme from "./utils/theme";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { usePlaces, useSheets } from "utils/context";

dayjs.locale("ko");

export const requestFetch = (type, payload) => {
  if (window.ReactNativeWebView)
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
};
const messageTypes = ["load", "add_sheet", "alert"];
function App() {
  const initialized = useRef(false);
  const [, setSheets] = useSheets();
  const [, setPlaces] = usePlaces();
  const onMessage = ({ data }) => {
    try {
      if (!data) return;
      const { type, payload } = JSON.parse(data);
      if (!type || !messageTypes.includes(type)) return;
      switch (type) {
        case "load":
          initialized.current = true;
          payload.sheets && setSheets(payload.sheets);
          payload.places && setPlaces(payload.places);
          break;
        case "add_sheet":
          setSheets((state) => [...state, payload]);
          break;
        case "alert":
          window.alert(payload.message);
          break;
        default:
      }
    } catch (err) {
      sendConsoleLog("err: " + err);
    }
  };
  useEffect(() => {
    sendConsoleLog("React is mounted");
    const loadAppData = () => {
      if (window.ReactNativeWebView)
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load" }));
    };
    loadAppData();

    if (window.platformOS === "ios")
      window.addEventListener("message", onMessage);
    else document.addEventListener("message", onMessage);
    return () => {
      if (window.platformOS === "ios")
        window.removeEventListener("message", onMessage);
      else document.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        sx={{ "&.MuiContainer-root": { maxWidth: "100%", padding: 0 } }}
      >
        <MainView />
      </Container>
    </ThemeProvider>
  );
}

export default App;

export const sendConsoleLog = (text) => {
  if (window.ReactNativeWebView)
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "log", data: text })
    );
};
