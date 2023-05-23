import React, { FC, useEffect, useState } from "react";
import { fullSizeMargin } from "../constants";
import { useAnnotationsContext, useAppContext } from "../context";
import { FormatType } from "../types/formats";
import { formatSize, mergeBounds } from "../utils";
import { getAnnotationsBounds } from "@linkurious/annotations-control";

export const FormatInfo: FC<FormatType> = ({ value }) => {
  const { ogma, boundingBox, format, textsVisible } = useAppContext();
  const { annotations } = useAnnotationsContext();
  const [, setZoom] = useState(1);
  let dimensions = "";

  useEffect(() => {
    const onMove = () => {
      setZoom(ogma.view.getZoom());
    };
    ogma?.events.on("move", onMove);
    return () => {
      ogma?.events.off(onMove);
    };
  }, [ogma]);

  useEffect(() => {
    if (ogma) setZoom(ogma.view.getZoom());
  }, [ogma, textsVisible, boundingBox, annotations]);

  if (!boundingBox || !ogma) return null;

  const combinedBoundingBox =
    annotations.features.length === 0
      ? boundingBox
      : mergeBounds(getAnnotationsBounds(annotations), boundingBox);

  if (typeof value === "undefined") {
    const margin = format.value === undefined ? fullSizeMargin : 0;
    const [minX, minY, maxX, maxY] = combinedBoundingBox;

    const lb = ogma.view.graphToScreenCoordinates({ x: minX, y: minY });
    const rt = ogma.view.graphToScreenCoordinates({ x: maxX, y: maxY });
    const width = Math.round((rt.x - lb.x) * (1 + margin * 2));
    const height = Math.round((rt.y - lb.y) * (1 + margin * 2));
    dimensions = formatSize({ width, height });
  } else dimensions = formatSize(value);

  return <div className="dimensions">{dimensions}</div>;
};
