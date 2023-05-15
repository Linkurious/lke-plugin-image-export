import { FC, useCallback } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { arrowIconSize, iconSize } from "../constants";
import { NavArrowDown } from "iconoir-react";
import { ArrowRight as RightArrowIcon } from "iconoir-react";
import { useAnnotationsContext, useAppContext } from "../../../context";
import { ArrowStylePanel } from "./StylePanel";
import { createArrow, isArrow } from "@linkurious/annotations-control";
import { MouseButtonEvent, MouseOutEvent } from "@linkurious/ogma/dev";
import { LkEdgeData, LkNodeData } from "@linkurious/rest-client";

interface ArrowDropdownProps {}

export const ArrowDropDown: FC<ArrowDropdownProps> = () => {
  const { editor, arrowStyle, currentAnnotation, setCurrentAnnotation } =
    useAnnotationsContext();
  const { ogma } = useAppContext();
  const isActive = currentAnnotation && isArrow(currentAnnotation);
  const onClick = useCallback(() => {
    const arrow = createArrow(0, 0, 0, 0, arrowStyle);
    setCurrentAnnotation(arrow);

    const onKeyUp = (evt: { code: number }) => {
      if (evt.code === 27) {
        setCurrentAnnotation(null);
        //setIsDrawing(false);
      }
    };

    const onMouseDown = (evt: MouseButtonEvent<LkNodeData, LkEdgeData>) => {
      requestAnimationFrame(() => {
        const { x, y } = ogma.view.screenToGraphCoordinates(evt);
        arrow.geometry = createArrow(x, y, x, y, arrowStyle).geometry;
        editor.startArrow(x, y, arrow);
        setCurrentAnnotation(arrow);
      });
    };

    ogma.events.once("keyup", onKeyUp).once("mousedown", onMouseDown);

    return () => {
      ogma.events.off(onKeyUp).off(onMouseDown);
    };
  }, [editor, arrowStyle, setCurrentAnnotation]);

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
