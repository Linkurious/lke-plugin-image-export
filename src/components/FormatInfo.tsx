import React, { FC, useEffect, useState } from "react";
import { useAppContext } from "../context";
import { FormatType } from "../types/formats";

export const FormatInfo: FC<FormatType> = ({ label, value }) => {
  const { ogma, boundingBox } = useAppContext();
  const [zoom, setZoom] = useState(1);
  let dimensions = "";

  useEffect(() => {
    if (ogma)
      ogma.events.on("cameraMove", () => {
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
    dimensions = `${width} × ${height} px`;
  } else dimensions = `${value.width} × ${value.height} px`;

  return <div className="dimensions">{dimensions}</div>;
};
