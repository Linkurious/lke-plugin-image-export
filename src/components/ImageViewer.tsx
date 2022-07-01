import React, { FC, useEffect, useState, useLayoutEffect } from "react";
import { Button } from "antd";
import panzoomLib, { PanZoom } from "panzoom";
import {
  ExpandOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Size } from "@linkurious/ogma";
import { useDimensions } from "../hooks";
//import { stringtoBase64, stringToSVGElement } from "../utils";

export const ImageViewer: FC<{
  svg: string;
  size: Size;
  background: boolean;
}> = ({ svg, size }) => {
  let [ref, dimensions] = useDimensions();
  const [panzoom, setPanzoom] = useState<PanZoom>();
  dimensions = dimensions || ({ width: 0, height: 0 } as DOMRect);

  const k = Math.min(
    dimensions.width / size.width,
    dimensions.height / size.height
  );
  const x = (dimensions.width - size.width * k) / 2;
  const y = (dimensions.height - size.height * k) / 2;

  const svgRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (!svgRef.current || !dimensions) return;
    const svgContainer = svgRef.current.querySelector("svg") as SVGSVGElement;
    svgContainer.setAttribute("width", "");
    //svgContainer.setAttribute("height", dimensions.height.toString());
    setPanzoom(
      panzoomLib(
        svgRef.current.querySelector(".tranform-group") as SVGRectElement
      )
    );
  }, [svg, dimensions]);

  const imageClass = "image-viewer--content"; // + (background ? "" : " transparent-bg");
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
    panzoom.moveTo(0, 0);
    panzoom.zoomAbs(0, 0, 1);
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
          onClick={() => zoom(1.4)}
          size="small"
          title="Zoom in"
          icon={<PlusSquareOutlined />}
        />
        <Button
          onClick={() => zoom(0.6)}
          size="small"
          title="Zoom out"
          icon={<MinusSquareOutlined />}
        />
      </div>
    </div>
  );
};
