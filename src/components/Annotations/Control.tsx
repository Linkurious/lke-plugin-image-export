import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import { Dropdown, Menu, Button, Divider, Space } from "antd";
import { SubnodeOutlined, DownOutlined } from "@ant-design/icons";
import { stopPropagation } from "../../utils";
import { Control } from "@linkurious/text-annotations";
import { Text as TextIcon, MapsArrowDiagonal, ArrowRight } from "iconoir-react";
import { useAppContext } from "../../context";

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
          icon={<DownOutlined />}
          menu={{ items: [] }}
          onClick={() => console.log("add text")}
          trigger={["click"]}
          dropdownRender={(menu) => (
            <div className="annotations-control--panel dropdown-content">
              <Button type="primary">Click me!</Button>
            </div>
          )}
        >
          <TextIcon height={iconSize} width={iconSize} fr="" />
        </Dropdown.Button>
        <Dropdown.Button
          trigger={["click"]}
          icon={<DownOutlined />}
          onClick={() => console.log("add arrow")}
          dropdownRender={(menu) => (
            <div className="annotations-control--panel dropdown-content">
              <Button type="primary">Click me!</Button>
            </div>
          )}
        >
          <ArrowRight height={iconSize} width={iconSize} fr="" />
        </Dropdown.Button>
      </Button.Group>
    </div>
  );
};
