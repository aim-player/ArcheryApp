import React, { useRef, useState } from "react";
import { Platform, SafeAreaView, Share, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import LoginView, { signOutGoogle } from "@/src/LoginView.jsx";

import { URL } from "@env";

function App() {
  const webviewRef = useRef();
  const [openLogin, setOpenLogin] = useState(false);

  const sendMessage = (type, payload = {}) => {
    webviewRef.current.postMessage(JSON.stringify({ type, payload: payload }));
  };

  const handleMessage = async (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === "log") {
      console.log("LOG ===== " + JSON.stringify(message.data));
    } else if (message.type === "login") {
      setOpenLogin(true);
    } else if (message.type === "signout") {
      signOutGoogle();
    }
    switch (message.type) {
      case "invite":
        Share.share({
          title: `${message.payload.name} 팀에 초대합니다`,
          url: URL + `/?team_id=${message.payload.team_id}`,
        });
        break;
      default:
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        source={{ uri: URL }}
        onMessage={handleMessage}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        injectedJavaScript={`window.platformOS = '${Platform.OS}'`}
      />
      <LoginView
        open={openLogin}
        close={() => setOpenLogin(false)}
        sendMessage={sendMessage}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
export default App;
