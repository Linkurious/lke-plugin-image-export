import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Minimap } from "./Minimap";
import { Ogma } from "./Ogma";
import { ZoomControl } from "./ZoomControl";
import { VersionInfo } from "./VersionInfo";

export function Visualisation() {
  const { visualisation, configuration, graphSchema, setOgma, format } =
    useAppContext();
  return (
    <>
      <Ogma
        graph={visualisation}
        options={configuration.ogmaConfig}
        schema={graphSchema}
        onReady={(ogma) => setOgma(ogma)}
        baseUrl={configuration.baseUrl}
      >
        <ZoomControl />
        <Minimap />
        <VersionInfo />
      </Ogma>
      <Backdrop format={format} />
    </>
  );
}
