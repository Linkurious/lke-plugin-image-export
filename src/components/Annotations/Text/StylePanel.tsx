import { FC } from "react";

import Form from "antd/es/form";
import Dropdown from "antd/es/dropdown/dropdown";

import ColorPicker from "@uiw/react-color-swatch";

import { DownArrowIcon } from "../icons";
import {
  fontItems,
  fontSizeItems,
  colors,
  backgroundColors,
} from "../constants";
import { colorIcon } from "../icons/Color";
import { useAnnotationsContext } from "../../../context";

interface TextStylePanelProps {}

export const TextStylePanel: FC<TextStylePanelProps> = () => {
  const { textStyle, setTextStyle } = useAnnotationsContext();
  return (
    <div className="annotations-control--panel text-styles-panel dropdown-content">
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
        <Form.Item label="Text color" className="style-color">
          <ColorPicker colors={colors} rectRender={colorIcon} />
        </Form.Item>
        <Form.Item label="Background color" className="style-background">
          <ColorPicker
            colors={backgroundColors}
            color={textStyle.background}
            rectRender={colorIcon}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
