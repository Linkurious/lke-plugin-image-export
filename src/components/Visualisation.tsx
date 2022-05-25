import { LKOgma } from "@linkurious/ogma-linkurious-parser";
import React from "react";
import { useAppContext } from "../context";
import { Ogma } from "./Ogma";

export function Visualisation() {
  const { visualisation, configuration } = useAppContext();
  return <Ogma graph={visualisation} options={configuration} />;
}
