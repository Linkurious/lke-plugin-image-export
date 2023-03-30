import { FC, useCallback } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { arrowIconSize, iconSize } from "../constants";
import { DownArrowIcon } from "../icons";
import { NavArrowDown } from "iconoir-react";
import { ArrowRight as RightArrowIcon } from "iconoir-react";
import { useAnnotationsContext, useAppContext } from "../../../context";
import { ArrowStylePanel } from "./StylePanel";

interface ArrowDropdownProps {}

export const ArrowDropDown: FC<ArrowDropdownProps> = () => {
  // const { editor } = useAnnotationsContext();
  // const { ogma } = useAppContext();
  const onClick = useCallback(() => {
    console.log("start new arrow annotation");
  }, []);

  return (
    <Dropdown.Button
      title="Arrow / Line"
      size="small"
      className="annotations-arrow--dropdown"
      trigger={["click"]}
      icon={<NavArrowDown width={arrowIconSize} />}
      onClick={onClick}
      dropdownRender={() => <ArrowStylePanel />}
    >
      <RightArrowIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
