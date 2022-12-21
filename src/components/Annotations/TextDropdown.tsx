import React, { FC } from "react";
import { Dropdown } from "antd";
import { DownArrowIcon } from "./DownArrowIcon";
import { Text as TextIcon } from "iconoir-react";
import { TextStylePanel } from "./TextStylePanel";
import { iconSize } from "./constants";

export const TextDropdown: FC = () => (
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
);
