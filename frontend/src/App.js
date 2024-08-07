import "./App.css";
import { CssBaseline, Container, ThemeProvider } from "@mui/material";
import MainView from "./views/MainView";
import theme from "./utils/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        sx={{ "&.MuiContainer-root": { maxWidth: "100%", padding: 0 } }}
      >dsf
        <MainView />
      </Container>
    </ThemeProvider>
  );
}

export default App;
