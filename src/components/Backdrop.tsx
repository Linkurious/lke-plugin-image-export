import React, { FC, useLayoutEffect, useState } from "react";
import { Size } from "@linkurious/ogma";
import { Format } from "../types/formats";
import { formatLookup } from "../constants";

interface BackdropProps {
  format: Format;
}

export const Backdrop: FC<BackdropProps> = ({ format }) => {
  const currentFormat = formatLookup[format];
  const [windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const updateSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      //console.log({ windowWidth, windowHeight });
      setWindowSize({ width: windowWidth, height: windowHeight });
    };
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [currentFormat]);
  const borderWidth = 0;
  return (
    <div
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        border: `${borderWidth}px solid rgba(0, 0, 0, 0.2)`,
        position: "absolute",
        pointerEvents: "none",
        top: `0px`,
        left: `0px`,
      }}
    ></div>
  );
};
