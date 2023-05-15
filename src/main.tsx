import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "./App";
import "./assets/styles.css";

const container =
  document.getElementById("root") || document.querySelector("lk-app-root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOMClient.createRoot(container!);

root.render(<App />);
