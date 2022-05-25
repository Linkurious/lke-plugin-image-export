import React, { useEffect } from "react";
import { AppContextProvider } from "./context";
import { Dashboard } from "./screens/Dashboard";

export default function App() {
  return (
    <AppContextProvider>
      <Dashboard />
    </AppContextProvider>
  );
}
