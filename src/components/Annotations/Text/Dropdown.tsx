import { FC, useCallback } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { Text as TextIcon } from "iconoir-react";
import { TextStylePanel } from "./StylePanel";
import { useAnnotationsContext, useAppContext } from "../../../context";
import { iconSize } from "../constants";
import { DownArrowIcon } from "../icons";

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
      menu={{ items: [] }}
      trigger={["click"]}
      onClick={onClick}
      icon={<DownArrowIcon />}
      dropdownRender={() => <TextStylePanel />}
    >
      <TextIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
