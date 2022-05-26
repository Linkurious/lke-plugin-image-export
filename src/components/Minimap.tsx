import React, { useEffect, useState } from "react";
import { svg as preview } from "@linkurious/mini-svg-exporter";
import { useAppContext } from "../context";

export function Minimap() {
  const { ogma } = useAppContext();

  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (!ogma) return;
    ogma.events.on(["addNodes", "addEdges"], () => {
      ogma.export
        .json({ download: false, nodeData: () => null, edgeData: () => null })
        .then((json) => {
          const svgString = preview(json, { size: 150 });
          // encodeURIComponent is heavy, so do it only on change
          setSvg(encodeURIComponent(svgString));
        });
    });
  }, [ogma]);

  if (!ogma) return null;
  return (
    <div className="minimap">
      <img src={`data:image/svg+xml;utf8,${svg}`} />
    </div>
  );
}
