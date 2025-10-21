import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Minimap } from "./Minimap";
import { Ogma } from "./Ogma";
import { ZoomControl } from "./ZoomControl";
import { VersionInfo } from "./VersionInfo";

export function Visualisation() {
  const { visualisation, setOgma, format, nodeGroupingRules } =
    useAppContext();

  return (
    <>
      <Ogma
        graph={visualisation}
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
