import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
const customPalette = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      light: "#5d94c7",
      main: "#266696",
      dark: "#003c68",
      contrastText: "#fff"
    },
    secondary: {
      light: "#5d94c7",
      main: "#266696",
      dark: "#003c68",
      contrastText: "#fff"
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={customPalette}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
