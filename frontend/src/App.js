import { CssBaseline, Container, ThemeProvider } from "@mui/material";
import {
  useEnds,
  usePlaces,
  useRounds,
  useSheets,
  useUser,
} from "utils/context";
import { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import MainView from "./views/MainView";
import theme from "./utils/theme";
import "./App.css";
import { getUserData, refreshSession, requestLogin } from "utils/fetch";
import ProfileInitializer from "components/login/ProfileInitializer";
import { URL } from "constants/url";
import { CustomAlert, CustomConfirm } from "components/Components";

dayjs.locale("ko");

export const requestFetch = (type, payload) => {
  if (window.ReactNativeWebView)
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
};
const messageTypes = ["load", "add_sheet", "alert", "login/success"];
function App() {
  const loadData = useDataLoader();
  const initialized = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useUser();
  const [, setSheets] = useSheets();
  const [, setPlaces] = usePlaces();
  const doGoogleLogin = async (payload) => {
    const response = await requestLogin("google", payload);
    if (!response) return;
    const { userInfo } = response.data;
    setUser(userInfo);
    sendConsoleLog(userInfo);
  };
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
        case "login/success":
          sendConsoleLog("===========");
          doGoogleLogin(payload);
          break;
        default:
          sendConsoleLog("Not Defined Type: " + type);
      }
    } catch (err) {
      sendConsoleLog("err: " + err);
    }
  };
  useEffect(() => {
    const refresh = async () => {
      const session = await refreshSession();
      if (session) setUser(session);
    };
    refresh();

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

  useEffect(() => {
    if (user) {
      const { role, name } = user;
      if (!role || !name) navigate(URL.PROFILE_INIT);
      else {
        if (!initialized.current) {
          loadData();
          initialized.current = true;
        }
      }
    }
  }, [user, location]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        sx={{ "&.MuiContainer-root": { maxWidth: "100%", padding: 0 } }}
      >
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path={URL.PROFILE_INIT} element={<ProfileInitializer />} />
        </Routes>
      </Container>
      <CustomAlert />
      <CustomConfirm />
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

export const useDataLoader = () => {
  const [user] = useUser();
  const [, setSheets] = useSheets();
  const [, setRounds] = useRounds();
  const [, setEnds] = useEnds();

  const loadData = async () => {
    if (!user) return;
    const { sheets, rounds, ends } = await getUserData();
    setSheets(sheets);
    setRounds(rounds);
    setEnds(ends);
  };

  return loadData;
};
