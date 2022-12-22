import React, { FC, useCallback } from "react";
import { Dropdown } from "antd";
import { DownArrowIcon } from "./DownArrowIcon";
import { Text as TextIcon } from "iconoir-react";
import { TextStylePanel } from "./TextStylePanel";
import { iconSize } from "./constants";
import { useAnnotationsContext } from "../../context/annotations";

export const TextDropdown: FC = () => {
  const { editor, annotations, textStyle } = useAnnotationsContext();
  const onClick = useCallback(() => {
    console.log("add text");
  }, [editor, annotations, textStyle]);
  return (
    <Dropdown.Button
      size="small"
      className="annotations-text--dropdown"
      icon={<DownArrowIcon />}
      menu={{ items: [] }}
      onClick={onClick}
      trigger={["click"]}
      dropdownRender={() => <TextStylePanel />}
    >
      <TextIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
