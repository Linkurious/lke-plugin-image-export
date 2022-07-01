import React, { FC, useEffect, useState, createRef } from "react";
import { Button } from "antd";
import panzoomLib, { PanZoom } from "panzoom";
import {
  ExpandOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Size } from "@linkurious/ogma";
import { useDimensions } from "../hooks";
import { useAppContext } from "../context";

export const ImageViewer: FC<{
  svg: string;
  size: Size;
  background: boolean;
}> = ({ svg, size, background }) => {
  let [ref, dimensions] = useDimensions();
  const { ogma } = useAppContext();
  const [panzoom, setPanzoom] = useState<PanZoom>();
  dimensions = dimensions || ({ width: 0, height: 0 } as DOMRect);

  const k = Math.min(
    dimensions.width / size.width,
    dimensions.height / size.height
  );
  const x = (dimensions.width - size.width * k) / 2;
  const y = (dimensions.height - size.height * k) / 2;

  const svgRef = createRef<HTMLDivElement>();
  useEffect(() => {
    if (!svgRef.current || !dimensions) return;
    const svgContainer = svgRef.current.querySelector("svg") as SVGSVGElement;
    const panzoomInstance = panzoomLib(
      svgRef.current.querySelector(".transform-group") as SVGRectElement
    );
    panzoomInstance.zoomAbs(0, 0, k);
    panzoomInstance.moveTo(x, y);
    setPanzoom(panzoomInstance);
    if (dimensions.width) {
      svgContainer.setAttribute("width", dimensions.width.toString());
      svgContainer.setAttribute("height", dimensions.height.toString());
    }
    return () => {
      panzoomInstance.dispose();
    };
  }, [svg, dimensions]);

  useEffect(() => {
    if (!svgRef.current) return;
    const bg = svgRef.current.querySelector(
      ".ogma-svg-background"
    ) as SVGRectElement;
    bg.setAttribute("fill-opacity", "1");
    bg.setAttribute(
      "fill",
      background
        ? (ogma.getOptions().backgroundColor as string)
        : "url(#pattern-checkers)"
    );
  }, [background]);

  const imageClass = "image-viewer--content";
  const zoom = (scaleMultiplier: number) => {
    if (!panzoom || !svgRef.current) return;
    const containerRect = (
      svgRef.current.parentNode as HTMLDivElement
    ).getBoundingClientRect();
    panzoom.smoothZoom(
      containerRect.width / 2,
      containerRect.height / 2,
      scaleMultiplier
    );
  };

  const reset = () => {
    if (!panzoom) return;
    panzoom.zoomAbs(0, 0, k);
    panzoom.moveTo(x, y);
  };

  return (
    <div className="image-viewer--container" ref={ref}>
      <div className="image-viewer">
        <div
          ref={svgRef}
          className={imageClass}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <div className="image-viewer--tools">
        <Button
          onClick={reset}
          size="small"
          className="fit-button"
          title="Reset"
          icon={<ExpandOutlined />}
        />
        <Button
          onClick={() => zoom(Math.SQRT2)}
          size="small"
          title="Zoom in"
          icon={<PlusSquareOutlined />}
        />
        <Button
          onClick={() => zoom(Math.SQRT1_2)}
          size="small"
          title="Zoom out"
          icon={<MinusSquareOutlined />}
        />
      </div>
    </div>
  );
};
