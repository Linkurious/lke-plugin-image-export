import React, { FC } from "react";
import { Dropdown } from "antd";
import { DownArrowIcon } from "./DownArrowIcon";
import { ArrowRight } from "iconoir-react";
import { ArrowStylePanel } from "./ArrowStylePanel";
import { iconSize } from "./constants";

export const ArrowDropdown: FC = () => (
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
);
