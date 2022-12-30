import React, { FC } from "react";
import { Button, Form, Menu, MenuProps } from "antd";
import { DoubleArrowIcon } from "./icons/DoubleArrow";
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
        onSelect={(e) => console.log("select", e)}
        items={[
          {
            label: "Line width",
            type: "group",
            className: "line-width-select--group-header",
            children: lineWidthItems!.map((item) => {
              if (!item) return null;
              const borderWidth = item.key || "0";
              return {
                ...item,
                label: (
                  <div
                    className="line-width-select--item"
                    style={{ borderWidth: `${borderWidth}px` }}
                  />
                ),
              };
            }) as MenuProps["items"],
          },
        ]}
      />
      <ColorPicker colors={colors} />
    </Form>
  </div>
);
