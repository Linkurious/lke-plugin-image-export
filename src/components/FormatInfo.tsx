import { FC, useEffect, useState } from "react";
import { useAnnotationsContext, useAppContext } from "../context";
import { FormatType } from "../types/formats";
import { formatSize } from "../utils";
import { defaultOptions, getExportSize } from "../utils/svg";

export const FormatInfo: FC<FormatType> = ({ value }) => {
  const { ogma, boundingBox, textsVisible } = useAppContext();
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

  if (typeof value === "undefined") {
    const { width, height } = getExportSize(ogma, annotations, {
      ...defaultOptions,
    });

    dimensions = formatSize({ width, height });
  } else dimensions = formatSize(value);

  return <div className="dimensions">{dimensions}</div>;
};
