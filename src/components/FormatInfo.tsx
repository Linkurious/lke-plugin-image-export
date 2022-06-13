import React, { FC, useEffect, useState } from "react";
import { useAppContext } from "../context";
import { FormatType } from "../types/formats";
import { formatSize } from "../utils";

export const FormatInfo: FC<FormatType> = ({ label, value }) => {
  const { ogma, boundingBox } = useAppContext();
  const [, setZoom] = useState(1);
  let dimensions = "";

  useEffect(() => {
    if (ogma)
      ogma.events.on("move", () => {
        setZoom(ogma.view.getZoom());
      });
  }, [ogma]);

  if (!boundingBox || !ogma) return null;

  if (typeof value === "undefined") {
    if (!isFinite(boundingBox.width) || !isFinite(boundingBox.height))
      return null;

    const lb = ogma.view.graphToScreenCoordinates({
      x: boundingBox.minX,
      y: boundingBox.minY,
    });
    const rt = ogma.view.graphToScreenCoordinates({
      x: boundingBox.maxX,
      y: boundingBox.maxY,
    });
    const width = Math.round(rt.x - lb.x);
    const height = Math.round(rt.y - lb.y);
    dimensions = formatSize({ width, height });
  } else dimensions = formatSize(value);

  return <div className="dimensions">{dimensions}</div>;
};
