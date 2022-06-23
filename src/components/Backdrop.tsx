import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { Point, Size } from "@linkurious/ogma";
import { FormatType } from "../types/formats";
import { useAppContext } from "../context";
import { scaleGraph } from "../utils";
import { backdropMargin } from "../constants";

interface BackdropProps {
  format: FormatType;
}

interface BorderWidth {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

function getScale(width: number, height: number, format: FormatType): number {
  let scale = 1;
  if (format.value) {
    if (
      format.value.width > width - backdropMargin ||
      format.value.height > height - backdropMargin
    ) {
      scale = Math.min(
        (width - backdropMargin) / format.value.width,
        (height - backdropMargin) / format.value.height
      );
    }
  }
  return scale;
}

function getBorderWidth(
  width: number,
  height: number,
  format: FormatType
): BorderWidth {
  let min: Point = { x: 0, y: 0 };
  let max: Point = { x: width, y: height };
  const borderScale = getScale(width, height, format);

  // fixed size
  if (format.value) {
    min = {
      x: Math.max(0, (width - format.value.width * borderScale) / 2),
      y: Math.max(0, (height - format.value.height * borderScale) / 2),
    };
    max = {
      x: (width + format.value.width * borderScale) / 2,
      y: (height + format.value.height * borderScale) / 2,
    };
  }

  const heightTop = min.y;
  const heightBottom = Math.max(0, height - max.y);
  const widthLeft = min.x;
  const widthRight = Math.max(0, width - max.x);

  return {
    top: heightBottom,
    left: widthLeft,
    right: widthRight,
    bottom: heightTop,
  };
}

// we need it here for the style rule, it cannot be in the component state
// otherwise it will not be updated
let globalScale = 1;

export const Backdrop: FC<BackdropProps> = ({ format }) => {
  const {
    ogma,
    graphScale,
    setGraphScale,
    scalingStyleRule,
    setScalingStyleRule,
  } = useAppContext();
  const [windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });
  const [borderWidth, setBorderWidth] = useState<BorderWidth>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (!ogma) return;
    const rule = ogma.styles.addRule({
      nodeSelector: () => true,
      edgeSelector: () => true,
      nodeAttributes: {
        radius: (n) => +n!.getAttribute("radius") * globalScale,
        text: {
          size: (n) => +n!.getAttribute("text.size") * globalScale,
        },
      },
      edgeAttributes: {
        width: (e) => +e!.getAttribute("width") * globalScale,
        text: {
          size: (e) => +e!.getAttribute("text.size") * globalScale,
        },
      },
    });
    setScalingStyleRule(rule);
  }, [ogma]);

  useLayoutEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const borderWidth = getBorderWidth(width, height, format);
      const scale = getScale(width, height, format);

      setBorderWidth(borderWidth);
      setWindowSize({ width, height });

      if (ogma) {
        // first drop to initial scale
        if (graphScale !== 1) scaleGraph(ogma, 1 / graphScale);
        // then apply the scale
        setGraphScale(scale);
        scaleGraph(ogma, scale);
      }
    };
    updateSize();

    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [format, scalingStyleRule]);

  useEffect(() => {
    globalScale = graphScale;
    if (scalingStyleRule) scalingStyleRule.refresh();
  }, [scalingStyleRule, graphScale]);

  return (
    <div
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        borderStyle: "solid",
        borderColor: `rgba(0, 0, 0, 0.4)`,

        borderRightWidth: `${borderWidth.right}px`,
        borderLeftWidth: `${borderWidth.left}px`,
        borderTopWidth: `${borderWidth.top}px`,
        borderBottomWidth: `${borderWidth.bottom}px`,

        position: "absolute",
        pointerEvents: "none",
        top: `0px`,
        left: `0px`,
      }}
      className="format-backdrop"
    />
  );
};
