import React, { FC, useCallback } from "react";
import { Button, Form, Menu, MenuProps } from "antd";
import { Minus, MoveRight } from "iconoir-react";
import ColorPicker from "@uiw/react-color-swatch";
import { hsvaToHex } from "@uiw/color-convert";

import { DoubleArrowIcon } from "./icons/DoubleArrow";
import { lineWidthItems, colors, ArrowDirection } from "./constants";
import { useAnnotationsContext } from "../../context/annotations";

type MenuItem = Required<MenuProps>["items"][number];

export const ArrowStylePanel: FC = () => {
  const { arrowStyle, setArrowStyle } = useAnnotationsContext();

  console.log(arrowStyle);

  const onLineWidthSelect = useCallback(
    (item: MenuItem & { key: string }) => {
      setArrowStyle({
        ...arrowStyle,
        strokeWidth: parseInt(item.key.toString() || "0"),
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
    (color) => {
      setArrowStyle({
        ...arrowStyle,
        strokeColor: hsvaToHex(color),
      });
    },
    [arrowStyle]
  );

  return (
    <div className="annotations-control--panel dropdown-content annotations-control--panel-arrow">
      <Form layout="horizontal">
        <Form.Item label="Direction">
          <Button.Group>
            <Button
              value={ArrowDirection.BOTH}
              type={arrowStyle.head && arrowStyle.tail ? "primary" : "default"}
              onClick={() => onDirectionSelect(ArrowDirection.BOTH)}
            >
              <DoubleArrowIcon />
            </Button>
            <Button
              value={ArrowDirection.NONE}
              type={arrowStyle.head ? "default" : "primary"}
              onClick={() => onDirectionSelect(ArrowDirection.NONE)}
            >
              <Minus fr="" />
            </Button>
            <Button
              value={ArrowDirection.HEAD}
              type={arrowStyle.head && !arrowStyle.tail ? "primary" : "default"}
              onClick={() => onDirectionSelect(ArrowDirection.HEAD)}
            >
              <MoveRight fr="" />
            </Button>
          </Button.Group>
        </Form.Item>
        <Menu
          className="line-width-select"
          onClick={onLineWidthSelect}
          selectedKeys={[arrowStyle.strokeWidth!.toString()]}
          selectable={false}
          items={[
            {
              label: "Line width",
              type: "group",
              className: "line-width-select--group-header",
              children: lineWidthItems!.map((item) => {
                if (!item) return null;
                const borderWidth = (item.key || "0").toString();
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
        <ColorPicker
          color={arrowStyle.strokeColor}
          colors={colors}
          onChange={onColorSelect}
          rectRender={(opts) => {
            const className = opts.checked
              ? "color-picker--item checked"
              : "color-picker--item";
            return (
              <div
                key={opts.key}
                onClick={opts.onClick}
                className={className}
                style={{ backgroundColor: opts.color }}
              />
            );
          }}
        />
      </Form>
    </div>
  );
};
