import React from "react";

import { useAppContext } from "../context";
import { Visualisation } from "./Visualisation";

export function Dashboard() {
  const { loading } = useAppContext();
  if (loading) return <div>Loading...</div>;
  return <Visualisation />;
}
