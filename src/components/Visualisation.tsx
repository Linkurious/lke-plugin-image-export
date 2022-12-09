import React from "react";
import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Minimap } from "./Minimap";
import { Ogma } from "./Ogma";
import { ZoomControl } from "./ZoomControl";
import { VersionInfo } from "./VersionInfo";
import { AnnotationsControl } from "./Annotations/Control";

export function Visualisation() {
  const { visualisation, configuration, setOgma, format } = useAppContext();
  return (
    <>
      <Ogma
        graph={visualisation}
        options={configuration}
        onReady={(ogma) => setOgma(ogma)}
      >
        <ZoomControl />
        <Minimap />
        <VersionInfo />
        <AnnotationsControl />
      </Ogma>
      <Backdrop format={format} />
    </>
  );
}
