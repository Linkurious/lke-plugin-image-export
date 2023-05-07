import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Minimap } from "./Minimap";
import { Ogma } from "./Ogma";
import { ZoomControl } from "./ZoomControl";
import { VersionInfo } from "./VersionInfo";

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
      </Ogma>
      <Backdrop format={format} />
    </>
  );
}
