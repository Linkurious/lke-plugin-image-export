import { FC, useCallback } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { Text as TextIcon } from "iconoir-react";
import { TextStylePanel } from "./StylePanel";
import { useAnnotationsContext, useAppContext } from "../../../context";
import { iconSize } from "../constants";
import { NavArrowDown } from "iconoir-react";

interface TextDropdownProps {}

export const TextDropdown: FC<TextDropdownProps> = () => {
  // const { editor } = useAnnotationsContext();
  // const { ogma } = useAppContext();

  const onClick = useCallback(() => {
    console.log("start new text annotation");
  }, []);
  return (
    <Dropdown.Button
      title="Text box"
      size="small"
      className="annotations-text--dropdown"
      trigger={["click"]}
      onClick={onClick}
      icon={<NavArrowDown width={12} />}
      dropdownRender={() => <TextStylePanel />}
    >
      <TextIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
