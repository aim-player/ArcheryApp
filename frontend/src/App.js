import { CssBaseline, Container, ThemeProvider } from "@mui/material";
import { usePlaces, useSheets, useUser } from "utils/context";
import { useEffect, useRef } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import MainView from "./views/MainView";
import theme from "./utils/theme";
import "./App.css";
import { requestLogin } from "utils/fetch";
import { URL } from "constants/url";

import ProfileInitializer from "components/login/ProfileInitializer";
import { CustomAlert, CustomConfirm } from "components/Components";
import TrainCreate from "components/train/TrainCreate";
import CustomBottomNavigation from "components/CustomBottomNavigation";
import PlayerEquipment from "components/master/PlayerEquipment";

import TrainView from "views/TrainView";
import TrainsView from "views/TrainsView";
import SettingView from "views/SettingView";
import TeamView from "views/TeamView";
import TeamTrainCreate from "components/master/TeamTrainCreate";
import TeamTrainView from "views/TeamTrainView";
import TeamTrainsView from "views/TeamTrainsView";
import TeamPlayerTrains from "views/TeamPlayerTrains";

dayjs.locale("ko");

export const requestFetch = (type, payload) => {
  if (window.ReactNativeWebView)
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
};
const messageTypes = ["load", "add_sheet", "alert", "login/success"];
function App() {
  // const loadData = useDataLoader();
  const initialized = useRef(false);
  const navigate = useNavigate();
  const [user, setUser] = useUser();
  const [, setSheets] = useSheets();
  const [, setPlaces] = usePlaces();
  const doGoogleLogin = async (payload) => {
    const response = await requestLogin("google", payload);
    if (!response) return;
    const { userInfo } = response.data;
    setUser(userInfo);
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
          doGoogleLogin(payload.data);
          break;
        default:
          sendConsoleLog("Not Defined Type: " + type);
      }
    } catch (err) {
      sendConsoleLog("err: " + err);
    }
  };
  useEffect(() => {
    // const refresh = async () => {
    //   const session = await refreshSession();
    //   if (session) setUser(session);
    // };
    // refresh();

    // const loadAppData = () => {
    //   if (window.ReactNativeWebView)
    //     window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load" }));
    // };
    // loadAppData();

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
          // loadData();
          initialized.current = true;
        }
      }
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&.MuiContainer-root": { padding: 0 },
        }}
      >
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path={URL.PROFILE_INIT} element={<ProfileInitializer />} />
          <Route path={URL.ADD_TRAIN} element={<TrainCreate />} />
          <Route path={URL.TRAINS} element={<TrainsView />} />
          <Route path={URL.TRAIN} element={<TrainView />} />
          <Route path={URL.SETTING} element={<SettingView />} />
          <Route path={URL.TEAM} element={<TeamView />} />
          <Route path={URL.PLAYER_EQUIPMENT} element={<PlayerEquipment />} />
          <Route path={URL.TEAM_TRAINS} element={<TeamTrainsView />} />
          <Route path={URL.TEAM_TRAIN} element={<TeamTrainView />} />
          <Route path={URL.ADD_TEAM_TRAIN} element={<TeamTrainCreate />} />
          <Route path={URL.TEAM_PLAYER_TRAINS} element={<TeamPlayerTrains />} />
        </Routes>
        <CustomBottomNavigation />
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
