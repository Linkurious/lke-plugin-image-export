import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import Ogma, { Point, Size, StyleRule } from "@linkurious/ogma";
import { Format, FormatType } from "../types/formats";
import { formatLookup } from "../constants";
import { useAppContext } from "../context";

interface BackdropProps {
  format: FormatType;
}

interface BorderWidth {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

function scaleGraph(ogma: Ogma, scale: number) {
  const { cx, cy } = ogma.view.getGraphBoundingBox();
  const positions = ogma.getNodes().getPosition();
  return ogma.getNodes().setAttributes(
    positions.map((pos, i) => {
      const dx = pos.x - cx;
      const dy = pos.y - cy;

      return {
        x: cx + dx * scale,
        y: cy + dy * scale,
      };
    })
  );
}

let globalScale = 1;

export const Backdrop: FC<BackdropProps> = ({ format }) => {
  const { ogma, graphScale, setGraphScale } = useAppContext();
  const [windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });
  const [borderWidth, setBorderWidth] = useState<BorderWidth>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [scalingRule, setScalingRule] = useState<StyleRule>();

  useEffect(() => {
    if (!ogma) return;
    const rule = ogma.styles.addRule({
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
    setScalingRule(rule);
  }, [ogma]);

  useLayoutEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let min: Point = { x: 0, y: 0 };
      let max: Point = { x: width, y: height };
      let borderScale = 1;

      // fixed size
      if (format.value) {
        const margin = 50;
        if (
          format.value.width > width - margin ||
          format.value.height > height - margin
        ) {
          const scale = Math.min(
            (width - margin) / format.value.width,
            (height - margin) / format.value.height
          );
          console.log("need to scale down", scale);
          //ogma.getContainer()!.style.transform = `scale(${scale})`;

          borderScale = scale;
        }

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

      setBorderWidth({
        top: heightBottom,
        left: widthLeft,
        right: widthRight,
        bottom: heightTop,
      });

      setWindowSize({ width, height });

      if (ogma) {
        // first drop to initial scale
        if (graphScale !== 1) scaleGraph(ogma, 1 / graphScale);
        // then apply the scale
        setGraphScale(borderScale);
        scaleGraph(ogma, borderScale);
      }
    };
    updateSize();

    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [format, scalingRule]);

  useEffect(() => {
    globalScale = graphScale;
    scalingRule?.refresh();
  }, [scalingRule, graphScale]);

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
