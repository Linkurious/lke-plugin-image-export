import React from "react";
import ReactDOM from "react-dom";
import App from "../src/App";

console.log("ICI", 
document.getElementById("root"),
document.querySelector('lk-app-root'))
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
  || document.querySelector('lk-app-root')
);
