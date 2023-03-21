import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import Button from "antd/es/button/button";
import React, { FC } from "react";
import { useAppContext } from "../context";

export const ZoomControl: FC = () => {
  const { ogma } = useAppContext();
  if (!ogma) return null;
  const modifier = Math.SQRT2;
  return (
    <div className="zoom-control">
      <Button
        onClick={() => ogma.view.zoomIn(modifier)}
        size="small"
        title="Zoom in"
        icon={<PlusSquareOutlined />}
      />
      <Button
        onClick={() => ogma.view.zoomOut(modifier)}
        size="small"
        title="Zoom out"
        icon={<MinusSquareOutlined />}
      />
    </div>
  );
};
