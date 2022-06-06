import React from "react";
import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Ogma } from "./Ogma";

export function Visualisation() {
  const { visualisation, configuration, setOgma } = useAppContext();
  return (
    <>
      <Ogma
        graph={visualisation}
        options={configuration}
        onReady={(ogma) => setOgma(ogma)}
      />
      <Backdrop format="Square" />
    </>
  );
}
