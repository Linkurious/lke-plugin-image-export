import { useEffect } from "react";
import MinimapControl from "@linkurious/ogma-mini-map";
import { useAppContext } from "../context";

export function Minimap() {
  const { ogma } = useAppContext();

  useEffect(() => {
    let minimap: MinimapControl;
    if (ogma)
      minimap = new MinimapControl(ogma, {
        width: 150,
        height: 150,
        strokeWidth: 0,
        fillColor: `rgba(0,0,0,0.2)`,
      });
    return () => {
      if (minimap) minimap.destroy();
    };
  }, [ogma]);

  return null;
}
