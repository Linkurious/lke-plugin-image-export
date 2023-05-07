import ReactDOMClient from "react-dom/client";
import App from "../src/App";

const container =
  document.getElementById("root") || document.querySelector("lk-app-root");
const root = ReactDOMClient.createRoot(container!);

root.render(<App />);
