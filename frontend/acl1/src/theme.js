import { createTheme, ThemeProvider } from '@mui/material/styles';
import "typeface-poppins";


const theme =createTheme({
    shape: {
      borderRadius: 25,
    },
    palette: {
      type: "light",
      primary: {
        main: "#259c94",
        light: "#5d16e6",
        dark: "#000000",
      },
      secondary: {
        main: "#086057",
      },
      background: {
        default: "#e9f6f5",
        paper: "#c1e6e2",
      },
      text: {
        secondary: "#281f2d",
        primary: "#0a080a",
      },
    },
    typography: {
      fontFamily: "Poppins",
      fontSize: 18,
      fontWeightBold: 1000,
      fontWeightMedium: 800,
      fontWeightRegular: 600,
      fontWeightLight: 500,
      htmlFontSize: 18,
      h1: {
        fontWeight: 1000,
      },
      h2: {
        fontWeight: 900,
      },
      h3: {
        fontWeight: 800,
      },
      h4: {
        fontWeight: 800,
      },
      h5: {
        fontWeight: 800,
      },
    },
    overrides: {
      shadows: "none",
      border: "none",
      MuiSwitch: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + $track": {
              opacity: 1,
              border: "none",
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: "1px solid #bdbdbd",
          backgroundColor: "#fafafa",
          opacity: 1,
          transition:
            "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
      },
    },
    props: {
      shadows: "none",
      border: "none",
      MuiButtonBase: {
        disableRipple: true,
      },
      MuiButton: {
        size: "medium",
      },
      MuiButtonGroup: {
        size: "medium",
      },
      MuiCheckbox: {
        size: "medium",
      },
      MuiFab: {
        size: "medium",
      },
      MuiFormControl: {
        margin: "dense",
        size: "medium",
      },
      MuiFormHelperText: {
        margin: "dense",
      },
      MuiIconButton: {
        size: "medium",
      },
      MuiInputBase: {
        margin: "dense",
      },
      MuiInputLabel: {
        margin: "dense",
      },
      MuiRadio: {
        size: "medium",
      },
      MuiSwitch: {
        size: "medium",
      },
      MuiTextField: {
        margin: "dense",
        size: "medium",
      },
      MuiAppBar: {
        color: "secondary",
      },
    },
    spacing: 12,
  });
  
export default theme;