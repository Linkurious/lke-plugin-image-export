import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "./App";
import "./assets/styles.css";

const container =
  document.getElementById("root") || document.querySelector("lk-app-root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOMClient.createRoot(container!);

function createBaseElement(){
  const base = document.createElement('base');
  // we take the first part of the url to get the base url (needed in case using baseFolder)
  base.href = document.location.href.split('plugins')[0];
  document.getElementsByTagName('head')[0].appendChild(base);
}

createBaseElement()

root.render(<App />);
