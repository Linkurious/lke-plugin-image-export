import React, { FC, useEffect, useState } from "react";
import { Button } from "antd";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  ExpandOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Size } from "@linkurious/ogma";
import { useDimensions } from "../hooks";

const ZoomWrapper: FC<{
  size: Size;
  dimensions: DOMRect;
  svg: string;
  zoomStep?: number;
  minScale?: number;
  maxScale?: number;
}> = ({
  svg,
  size,
  dimensions,
  zoomStep = 0.05,
  minScale = 0.01,
  maxScale = 100,
}) => {
  const k = Math.min(
    dimensions.width / size.width,
    dimensions.height / size.height
  );
  const x = (dimensions.width - size.width * k) / 2;
  const y = (dimensions.height - size.height * k) / 2;

  const [encoded, setEncoded] = useState("");

  useEffect(() => {
    setEncoded(
      `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
    );
  }, []);

  if (encoded === "") return null;
  return (
    <TransformWrapper
      wheel={{ step: zoomStep }}
      minScale={minScale}
      maxScale={maxScale}
      initialScale={k}
      initialPositionX={x}
      initialPositionY={y}
      limitToBounds={false}
    >
      {({ zoomIn, zoomOut, resetTransform }) => {
        return (
          <>
            <TransformComponent
              contentClass="image-viewer"
              wrapperClass="image-viewer--wrapper"
            >
              <img className="image-viewer--content" src={encoded} />
              {/* <div
                className="image-viewer--content"
                dangerouslySetInnerHTML={{ __html: svg }}
              /> */}
            </TransformComponent>
            <div className="image-viewer--tools">
              <Button
                onClick={() => resetTransform()}
                size="small"
                className="fit-button"
                title="Reset"
                icon={<ExpandOutlined />}
              />
              <Button
                onClick={() => zoomIn()}
                size="small"
                title="Zoom in"
                icon={<PlusSquareOutlined />}
              />
              <Button
                onClick={() => zoomOut()}
                size="small"
                title="Zoom out"
                icon={<MinusSquareOutlined />}
              />
            </div>
          </>
        );
      }}
    </TransformWrapper>
  );
};

export const ImageViewer = ({ svg, size }: { svg: string; size: Size }) => {
  const [ref, dimensions] = useDimensions();
  return (
    <div className="image-viewer--container" ref={ref} style={{ flex: 1 }}>
      {dimensions && (
        <ZoomWrapper size={size} dimensions={dimensions} svg={svg} />
      )}
    </div>
  );
};
