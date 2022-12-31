import React, { FC, useCallback, useState } from "react";
import { Dropdown } from "antd";
import { ArrowRight } from "iconoir-react";
import { createArrow } from "@linkurious/annotations-control";

import { DownArrowIcon } from "./icons/DownArrow";
import { ArrowStylePanel } from "./ArrowStylePanel";
import { iconSize } from "./constants";
import { useAnnotationsContext } from "../../context/annotations";

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

  const [isDrawing, setIsDrawing] = useState(false);

  const onClick = useCallback(() => {
    const arrow = createArrow(0, 0, 0, 0, arrowStyle);
    setCurrentAnnotation(arrow);
    setIsDrawing(false);
    let cancelled = false;
    ogma.events
      .once("keyup", (evt) => {
        if (evt.code === 27) {
          setCurrentAnnotation(null);
          setIsDrawing(false);
        }
      })
      .once("mouseup", (evt) => {
        requestAnimationFrame(() => {
          if (cancelled || isDrawing) return;
          setIsDrawing(true);
          const { x, y } = ogma.view.screenToGraphCoordinates(evt);
          arrow.geometry = createArrow(x, y, x, y, arrowStyle).geometry;
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
