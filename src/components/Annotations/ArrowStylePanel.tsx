import React, { FC } from "react";
import { Button, Form, Menu, MenuProps } from "antd";
import { DoubleArrowIcon } from "./icons/DoubleArrowIcon";
import { Minus, MoveRight } from "iconoir-react";
import ColorPicker from "@uiw/react-color-swatch";
import { lineWidthItems, colors } from "./constants";

const LineWidthMenu = ({ onSelect }: { onSelect: MenuProps["onSelect"] }) => {
  return (
    <Menu onSelect={onSelect}>
      <Menu.Item>
        <div style={{ border: "1px solid black", width: "30px" }}>1</div>
      </Menu.Item>
      <Menu.Item>
        <div style={{ border: "2px solid black", width: "30px" }}>2</div>
      </Menu.Item>
      <Menu.Item>
        <div style={{ border: "3px solid black", width: "30px" }}>3</div>
      </Menu.Item>
      <Menu.Item>
        <div style={{ border: "4px solid black", width: "30px" }}>4</div>
      </Menu.Item>
      <Menu.Item>
        <div style={{ border: "5px solid black", width: "30px" }}>5</div>
      </Menu.Item>
    </Menu>
  );
};

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
        // itemIcon={(p, b) => {
        //   console.log(p);
        //   return null;
        // }}
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
