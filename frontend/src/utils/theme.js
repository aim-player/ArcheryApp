import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#333",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: 0,
          minWidth: 0,
          minHeight: 0,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& input": {
            padding: 0,
          },
          "& div": {
            padding: 0,
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: { root: { minWidth: 0 }, grouped: { minWidth: 0 } },
    },
    MuiList: { styleOverrides: { root: { padding: 0 } } },
  },
});
export default theme;