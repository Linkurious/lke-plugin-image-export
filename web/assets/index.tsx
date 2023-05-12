import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "../../src/App";
import "./css/styles.css";

const container =
  document.getElementById("root") || document.querySelector("lk-app-root");
const root = ReactDOMClient.createRoot(container!);

root.render(<App />);
