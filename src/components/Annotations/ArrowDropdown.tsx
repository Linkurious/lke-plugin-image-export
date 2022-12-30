import React, { FC, useCallback } from "react";
import { Dropdown } from "antd";
import { ArrowRight } from "iconoir-react";

import { DownArrowIcon } from "./icons/DownArrowIcon";
import { ArrowStylePanel } from "./ArrowStylePanel";
import { iconSize } from "./constants";
import { useAnnotationsContext } from "../../context/annotations";
import { Arrow, createArrow } from "@linkurious/annotations-control";
import { useAppContext } from "../../context";

export const ArrowDropdown: FC = () => {
  const {
    editor,
    annotations,
    setAnnotations,
    setCurrentAnnotation,
    currentAnnotation,
    arrowStyle,
  } = useAnnotationsContext();
  const { ogma } = useAppContext();

  const onClick = useCallback(() => {
    ogma.events.once("mouseup", (evt) => {
      requestAnimationFrame(() => {
        const { x, y } = ogma.view.screenToGraphCoordinates(evt);
        const arrow = createArrow(x, y, x, y, arrowStyle);
        editor.startArrow(x, y, arrow);
        setCurrentAnnotation(arrow);
      });
    });
    //editor.add(newArrow);
  }, [editor, arrowStyle, annotations]);

  return (
    <Dropdown.Button
      size="small"
      className="annotations-arrow--dropdown"
      trigger={["click"]}
      icon={<DownArrowIcon />}
      onClick={onClick}
      type={
        currentAnnotation?.properties.type === "arrow" ? "primary" : "default"
      }
      dropdownRender={() => <ArrowStylePanel />}
    >
      <ArrowRight height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
