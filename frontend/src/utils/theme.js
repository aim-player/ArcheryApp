import { createTheme } from "@mui/material";

const theme = createTheme({
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

// mixins?: MixinsOptions;
// components?: Components<Omit<Theme, 'components'>>;
// palette?: PaletteOptions;
// shadows?: Shadows;
// transitions?: TransitionsOptions;
// typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
// zIndex?: ZIndexOptions;
// unstable_strictMode?: boolean;
// unstable_sxConfig?: SxConfig;
