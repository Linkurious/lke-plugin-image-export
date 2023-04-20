import { FC, useCallback } from "react";

import Form from "antd/es/form";
import Dropdown from "antd/es/dropdown/dropdown";
import { MenuProps } from "antd/es/menu";

import ColorPicker from "@uiw/react-color-swatch";

import { DownArrowIcon } from "../icons";
import {
  fontItems,
  fontSizeItems,
  colors,
  backgroundColors,
  fontFamilies,
  fontNameAliases,
  TRANSPARENT,
} from "../constants";
import { colorIcon } from "../icons/Color";
import { useAnnotationsContext } from "../../../context";
import { HsvaColor, hsvaToHex } from "@uiw/color-convert";

interface TextStylePanelProps {}

export const TextStylePanel: FC<TextStylePanelProps> = () => {
  const { textStyle, setTextStyle } = useAnnotationsContext();

  type MenuClickCallback = NonNullable<MenuProps["onClick"]>;

  const onFontSelect = useCallback<MenuClickCallback>(
    ({ key }) => {
      setTextStyle({
        ...textStyle,
        font: fontFamilies[key.toString() as fontNameAliases],
      });
    },
    [textStyle]
  );

  const currentFont = fontItems?.find(
    (font) => fontFamilies[font!.key as fontNameAliases] === textStyle.font
  ) as { label: string };

  const onFontSizeSelect = useCallback<MenuClickCallback>(
    ({ key }) => {
      setTextStyle({
        ...textStyle,
        fontSize: key.toString(),
        padding: +key / 4,
      });
    },
    [textStyle]
  );

  const currentFontSize = fontSizeItems?.find(
    (size) => size!.key === textStyle.fontSize
  ) as { label: string };

  const onTextColorSelect = useCallback(
    (hsva: HsvaColor) => {
      const color = hsvaToHex(hsva);
      setTextStyle({
        ...textStyle,
        color,
      });
    },
    [textStyle]
  );

  const onTextBgColorSelect = useCallback(
    (hsva: HsvaColor) => {
      const color = isNaN(hsva.v) ? TRANSPARENT : hsvaToHex(hsva);
      setTextStyle({
        ...textStyle,
        background: color,
      });
    },
    [textStyle]
  );

  return (
    <div className="annotations-control--panel annotations-control--panel-text dropdown-content">
      <Form layout="horizontal">
        <Form.Item label="Font">
          <Dropdown.Button
            className="text--font"
            menu={{ items: fontItems, onClick: onFontSelect }}
            trigger={["click"]}
            icon={<DownArrowIcon />}
            overlayClassName="text--font-dropdown"
          >
            {currentFont.label}
          </Dropdown.Button>
        </Form.Item>
        <Form.Item label="Size">
          <Dropdown.Button
            className="text--size"
            menu={{ items: fontSizeItems, onClick: onFontSizeSelect }}
            trigger={["click"]}
            overlayClassName="text--size-dropdown"
            icon={<DownArrowIcon />}
          >
            {currentFontSize.label}
          </Dropdown.Button>
        </Form.Item>
        <Form.Item label="Text color" className="style-color">
          <ColorPicker
            className="text--color-picker"
            colors={colors}
            rectRender={colorIcon}
            onChange={onTextColorSelect}
            color={textStyle.color}
          />
        </Form.Item>
        <Form.Item label="Background color" className="style-background">
          <ColorPicker
            className="text--background-color-picker"
            colors={backgroundColors}
            color={textStyle.background}
            onChange={onTextBgColorSelect}
            rectRender={colorIcon}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
