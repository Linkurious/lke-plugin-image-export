import { FC } from "react";

import Form from "antd/es/form";
import Dropdown from "antd/es/dropdown/dropdown";

import ColorPicker from "@uiw/react-color-swatch";

import { DownArrowIcon } from "../icons";
import { fontItems, fontSizeItems, colors } from "../constants";

interface TextStylePanelProps {}

export const TextStylePanel: FC<TextStylePanelProps> = () => {
  return (
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
        <Form.Item label="Text color">
          <ColorPicker colors={colors} />
        </Form.Item>
        <Form.Item label="Background color">
          <ColorPicker colors={colors} />
        </Form.Item>
      </Form>
    </div>
  );
};
