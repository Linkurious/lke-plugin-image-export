import React, { FC } from "react";
import { Button, Form, Menu } from "antd";
import { DoubleArrowIcon } from "./DoubleArrowIcon";
import { Minus, MoveRight } from "iconoir-react";
import ColorPicker from "@uiw/react-color-swatch";
import { lineWidthItems, colors } from "./constants";

export const ArrowStylePanel: FC = () => (
  <div className="annotations-control--panel dropdown-content annotations-control--panel-arrow">
    <Form layout="horizontal">
      <Form.Item label="Direction">
        <Button.Group>
          <Button value="both">
            <DoubleArrowIcon />
          </Button>
          <Button value="none">
            <Minus fr="" />
          </Button>
          <Button value="head">
            <MoveRight fr="" />
          </Button>
        </Button.Group>
      </Form.Item>
      <Menu
        className="line-width-select"
        items={[
          {
            label: "Line width",
            type: "group",
            className: "line-width-select--group-header",
            children: lineWidthItems,
          },
        ]}
      />
      <ColorPicker colors={colors} />
    </Form>
  </div>
);
