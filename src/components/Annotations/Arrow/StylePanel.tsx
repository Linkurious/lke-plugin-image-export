import { FC, useCallback } from "react";

import Form from "antd/es/form";
import Button from "antd/es/button";
import { MenuProps } from "antd/es/menu";

import { Minus } from "iconoir-react";
import ColorPicker from "@uiw/react-color-swatch";
import { HsvaColor, hsvaToHex } from "@uiw/color-convert";

import { LineWidthSelect } from "./LineWidthSelect";
import { DoubleArrowIcon, RightArrowIcon } from "../icons";
import { lineWidthItems, colors, ArrowDirection } from "../constants";
import { useAnnotationsContext } from "../../../context";
import { colorIcon } from "../icons/Color";

interface ArrowStylePanelProps {}

export const ArrowStylePanel: FC<ArrowStylePanelProps> = () => {
  const { arrowStyle, setArrowStyle } = useAnnotationsContext();

  const onLineWidthSelect = useCallback(
    (item: { value: number }) => {
      setArrowStyle({
        ...arrowStyle,
        strokeWidth: parseInt(item.value.toString() || "0"),
      });
    },
    [arrowStyle]
  );

  const onDirectionSelect = useCallback(
    (dir: ArrowDirection) => {
      setArrowStyle({
        ...arrowStyle,
        head:
          dir === ArrowDirection.HEAD || dir === ArrowDirection.BOTH
            ? "arrow"
            : undefined,
        tail: dir === ArrowDirection.BOTH ? "arrow" : undefined,
      });
    },
    [arrowStyle]
  );

  const onColorSelect = useCallback(
    (color: HsvaColor) => {
      setArrowStyle({
        ...arrowStyle,
        strokeColor: hsvaToHex(color),
      });
    },
    [arrowStyle]
  );

  const direction =
    arrowStyle.head && arrowStyle.tail && arrowStyle.tail !== "none"
      ? ArrowDirection.BOTH
      : !arrowStyle.head && !arrowStyle.tail
      ? ArrowDirection.NONE
      : ArrowDirection.HEAD;

  return (
    <div className="annotations-control--panel dropdown-content annotations-control--panel-arrow">
      <Form layout="horizontal">
        <Form.Item label="Direction">
          <Button.Group>
            <Button
              className="direction--both"
              value={ArrowDirection.BOTH}
              type={direction === ArrowDirection.BOTH ? "primary" : "default"}
              onClick={() => onDirectionSelect(ArrowDirection.BOTH)}
            >
              <DoubleArrowIcon />
            </Button>
            <Button
              className="direction--none"
              value={ArrowDirection.NONE}
              type={direction === ArrowDirection.NONE ? "primary" : "default"}
              onClick={() => onDirectionSelect(ArrowDirection.NONE)}
            >
              <Minus fr="" />
            </Button>
            <Button
              className="direction--head"
              value={ArrowDirection.HEAD}
              type={direction === ArrowDirection.HEAD ? "primary" : "default"}
              onClick={() => onDirectionSelect(ArrowDirection.HEAD)}
            >
              <RightArrowIcon />
            </Button>
          </Button.Group>
        </Form.Item>
        <LineWidthSelect
          options={lineWidthItems}
          selected={arrowStyle.strokeWidth || 1}
          onChange={onLineWidthSelect}
        />
        <ColorPicker
          className="arrow--color-picker"
          color={arrowStyle.strokeColor}
          colors={colors}
          onChange={onColorSelect}
          rectRender={colorIcon}
        />
      </Form>
    </div>
  );
};
