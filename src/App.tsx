import React, { useEffect } from "react";
import { AppContextProvider } from "./context";
import { Visualisation } from "./components/Visualisation";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  return (
    <AppContextProvider>
      <Dashboard />
    </AppContextProvider>
  );
}
