import React, { FC } from "react";
import { Button, Form, Menu } from "antd";
import { DoubleArrowIcon } from "./DoubleArrowIcon";
import { Minus, MoveRight } from "iconoir-react";
import ColorPicker from "@uiw/react-color-swatch";
import { lineWidthItems, colors } from "./constants";

export const ArrowStylePanel: FC = () => (
  <div className="annotations-control--panel dropdown-content">
    <Form layout="horizontal">
      <Form.Item label="Direction">
        <Button.Group>
          <Button value="large">
            <DoubleArrowIcon />
          </Button>
          <Button value="default">
            <Minus fr="" />
          </Button>
          <Button value="small">
            <MoveRight fr="" />
          </Button>
        </Button.Group>
      </Form.Item>
      <Form.Item label="Line width">
        <Menu className="line-width-select" items={lineWidthItems} />
      </Form.Item>
      <ColorPicker colors={colors} />
    </Form>
  </div>
);
