import React, { FC } from "react";
import { Form, Dropdown } from "antd";
import ColorPicker from "@uiw/react-color-swatch";
import { DownArrowIcon } from "./icons/DownArrowIcon";
import { fontItems, fontSizeItems, colors } from "./constants";

export const TextStylePanel: FC = () => (
  <div className="annotations-control--panel dropdown-content">
    <Form layout="horizontal">
      <Form.Item label="Font">
        <Dropdown.Button
          menu={{ items: fontItems }}
          trigger={["click"]}
          icon={<DownArrowIcon />}
        >
          Sans-serif
        </Dropdown.Button>
      </Form.Item>
      <Form.Item label="Size">
        <Dropdown.Button
          menu={{ items: fontSizeItems }}
          trigger={["click"]}
          icon={<DownArrowIcon />}
        >
          12
        </Dropdown.Button>
      </Form.Item>
      <ColorPicker colors={colors} />
    </Form>
  </div>
);
