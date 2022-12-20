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

const options = ["Option 1", "Option 2", "Option 3"];

const DropdownPanel = () => {
  const items = [
    { label: "item 1", key: "item-1" }, // remember to pass the key prop
    { label: "item 2", key: "item-2" },
  ];

  return (
    <Dropdown
      menu={{ items }}
      dropdownRender={(menu) => (
        <div className="dropdown-content">
          {menu}
          <Divider style={{ margin: 0 }} />
          <Space style={{ padding: 8 }}>
            <Button type="primary">Click me!</Button>
          </Space>
        </div>
      )}
    >
      <Button icon={<TextIcon height={22} width={22} fr="" />}>
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export const AnnotationsControl: FC<Props> = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ogma } = useAppContext();

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
        <Button icon={<TextIcon height={22} width={22} fr="" />} size="small" />
        <Button
          icon={<ArrowRight height={22} width={22} fr="" />}
          size="small"
        />
        <DropdownPanel />
      </Button.Group>
    </div>
  );
};
