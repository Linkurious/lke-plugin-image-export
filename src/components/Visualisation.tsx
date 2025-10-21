import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Minimap } from "./Minimap";
import { Ogma } from "./Ogma";
import { ZoomControl } from "./ZoomControl";
import { VersionInfo } from "./VersionInfo";

export function Visualisation() {
  const { visualisation, setOgma, format, nodeGroupingRules, ogmaConfig } =
    useAppContext();
  console.log("visualisation", visualisation);
  return (
    <>
      <Ogma
        graph={visualisation}
        options={ogmaConfig}
        onReady={(ogma) => setOgma(ogma)}
        appliedNodeGroupingRules={nodeGroupingRules}
      >
        <ZoomControl />
        <Minimap />
        <VersionInfo />
      </Ogma>
      <Backdrop format={format} />
    </>
  );
}
