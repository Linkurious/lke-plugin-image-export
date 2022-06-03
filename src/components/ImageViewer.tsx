import { Button } from "antd";
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { PlusCircleFilled, MinusCircleFilled } from "@ant-design/icons";
import { Size } from "@linkurious/ogma";

export const ImageViewer = ({ svg, size }: { svg: string; size: Size }) => {
  return (
    <TransformWrapper
      wheel={{ step: 0.02 }}
      minScale={0.01}
      maxScale={100}
      // initialPositionX={0.5 * size.width}
      // initialPositionY={0.5 * size.height}
      limitToBounds={false}
      centerOnInit={true}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <TransformComponent
            contentClass="image-viewer"
            wrapperClass="image-viewer--wrapper"
          >
            <div
              className="image-viewer--content"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </TransformComponent>
          <div className="image-viewer--tools">
            <Button
              onClick={() => zoomIn()}
              shape="circle"
              size="small"
              icon={<PlusCircleFilled />}
            />
            <Button
              onClick={() => zoomOut()}
              shape="circle"
              size="small"
              icon={<MinusCircleFilled />}
            />
            <Button
              onClick={() => resetTransform()}
              size="small"
              shape="circle"
              color="grey-8"
            />
          </div>
        </>
      )}
    </TransformWrapper>
  );
};
