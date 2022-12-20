import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import { Dropdown, Menu, MenuProps, Button, Divider, Space, Radio } from "antd";
import { SubnodeOutlined, DownOutlined } from "@ant-design/icons";
import { stopPropagation } from "../../utils";
import { Control } from "@linkurious/text-annotations";
import {
  Text as TextIcon,
  MapsArrowDiagonal,
  ArrowRight,
  ArrowLeft,
  NavArrowLeft,
  NavArrowRight,
  Minus,
  MoreHoriz,
  MoveRight,
  MoveLeft,
  Circle,
  Cancel,
} from "iconoir-react";
import { TwitterPicker as ColorPicker } from "react-color";
import { useAppContext } from "../../context";
import { DoubleArrowIcon } from "./DoubleArrowIcon";

import "@linkurious/text-annotations/style.css";
import "./Control.css";

interface Props {}

export const AnnotationsControl: FC<Props> = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ogma } = useAppContext();
  const iconSize = 22;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", stopPropagation);
    }
  }, [containerRef]);

  useEffect(() => {
    if (ogma) {
      const control = new Control(ogma);
    }
  }, [ogma]);

  const fontItems: MenuProps["items"] = [
    { key: "Normal", label: "Roboto" },
    { key: "Serif", label: "Serif" },
    { key: "Monospace", label: "Monospace" },
  ];

  const fontSizeItems: MenuProps["items"] = [
    { key: "8", label: "8" },
    { key: "10", label: "10" },
    { key: "12", label: "12" },
    { key: "14", label: "14" },
    { key: "16", label: "16" },
  ];

  const lineWidthItems: MenuProps["items"] = [
    { key: "1", label: "1" },
    { key: "2", label: "2" },
    { key: "3", label: "3" },
    { key: "4", label: "4" },
  ];

  return (
    <div className="annotations-control" ref={containerRef}>
      <Button.Group>
        <Dropdown.Button
          size="small"
          className="annotations-text--dropdown"
          icon={<DownOutlined height={1.5} width={5} />}
          menu={{ items: [] }}
          onClick={() => console.log("add text")}
          trigger={["click"]}
          dropdownRender={(menu) => (
            <div className="annotations-control--panel dropdown-content">
              <Dropdown.Button
                menu={{ items: fontItems }}
                trigger={["click"]}
                icon={<DownOutlined />}
              >
                Sans-serif
              </Dropdown.Button>
              <Dropdown.Button
                menu={{ items: fontSizeItems }}
                trigger={["click"]}
                icon={<DownOutlined />}
              >
                12
              </Dropdown.Button>
              <ColorPicker triangle="hide" />
            </div>
          )}
        >
          <TextIcon height={iconSize} width={iconSize} fr="" />
        </Dropdown.Button>
        <Dropdown.Button
          size="small"
          className="annotations-arrow--dropdown"
          trigger={["click"]}
          icon={<DownOutlined />}
          onClick={() => console.log("add arrow")}
          dropdownRender={(menu) => (
            <div className="annotations-control--panel dropdown-content">
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
              <Menu items={lineWidthItems} />
              <ColorPicker triangle="hide" />
            </div>
          )}
        >
          <ArrowRight height={iconSize} width={iconSize} fr="" />
        </Dropdown.Button>
      </Button.Group>
    </div>
  );
};
