import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  Dropdown,
  Menu,
  MenuProps,
  Button,
  Divider,
  Space,
  Radio,
  Form,
} from "antd";
import reactCss from "reactcss";
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
import { DownArrowIcon } from "./DownArrowIcon";
import { ArrowStylePanel } from "./ArrowStylePanel";
import { TextStylePanel } from "./TextStylePanel";

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

  return (
    <div className="annotations-control" ref={containerRef}>
      <Button.Group>
        <Dropdown.Button
          size="small"
          className="annotations-text--dropdown"
          icon={<DownArrowIcon />}
          menu={{ items: [] }}
          onClick={() => console.log("add text")}
          trigger={["click"]}
          dropdownRender={() => <TextStylePanel />}
        >
          <TextIcon height={iconSize} width={iconSize} fr="" />
        </Dropdown.Button>
        <Dropdown.Button
          size="small"
          className="annotations-arrow--dropdown"
          trigger={["click"]}
          icon={<DownArrowIcon />}
          onClick={() => console.log("add arrow")}
          dropdownRender={() => <ArrowStylePanel />}
        >
          <ArrowRight height={iconSize} width={iconSize} fr="" />
        </Dropdown.Button>
      </Button.Group>
    </div>
  );
};
