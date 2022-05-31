import React from "react";
import { useAppContext } from "../context";
import { Ogma } from "./Ogma";

export function Visualisation() {
  const { visualisation, configuration, setOgma } = useAppContext();
  return (
    <Ogma
      graph={visualisation}
      options={configuration}
      onReady={(ogma) => setOgma(ogma)}
    />
  );
}
