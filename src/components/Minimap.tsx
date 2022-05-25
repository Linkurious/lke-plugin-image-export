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
          setSvg(svgString);
          // const div = document.createElement("div");
          // div.innerHTML = svgString;
          // setSvg(div.firstChild as SVGSVGElement);
        });
    });
  }, [ogma]);

  if (!ogma) return null;
  return (
    <div className="minimap">
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} />
    </div>
  );
}
