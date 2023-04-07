import { FC, useCallback } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { arrowIconSize, iconSize } from "../constants";
import { NavArrowDown } from "iconoir-react";
import { ArrowRight as RightArrowIcon } from "iconoir-react";
import { useAnnotationsContext, useAppContext } from "../../../context";
import { ArrowStylePanel } from "./StylePanel";
import { createArrow, isArrow } from "@linkurious/annotations-control";

interface ArrowDropdownProps {}

export const ArrowDropDown: FC<ArrowDropdownProps> = () => {
  const {
    editor,
    annotations,
    arrowStyle,
    currentAnnotation,
    setCurrentAnnotation,
  } = useAnnotationsContext();
  const { ogma } = useAppContext();
  const isActive = currentAnnotation && isArrow(currentAnnotation);
  const onClick = useCallback(() => {
    const arrow = createArrow(0, 0, 0, 0, arrowStyle);
    setCurrentAnnotation(arrow);
    ogma.events
      .once("keyup", (evt) => {
        if (evt.code === 27) {
          setCurrentAnnotation(null);
          //setIsDrawing(false);
        }
      })
      .once("mousedown", (evt) => {
        requestAnimationFrame(() => {
          const { x, y } = ogma.view.screenToGraphCoordinates(evt);
          arrow.geometry = createArrow(x, y, x, y, arrowStyle).geometry;
          editor.startArrow(x, y, arrow);
          setCurrentAnnotation(arrow);
        });
      });
  }, [editor, arrowStyle, annotations]);

  return (
    <Dropdown.Button
      title="Arrow / Line"
      size="small"
      className="annotations-arrow--dropdown"
      trigger={["click"]}
      icon={<NavArrowDown width={arrowIconSize} />}
      type={isActive ? "primary" : "default"}
      onClick={onClick}
      dropdownRender={() => <ArrowStylePanel />}
    >
      <RightArrowIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
