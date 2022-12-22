import React, { FC, useCallback } from "react";
import { Dropdown } from "antd";
import { ArrowRight } from "iconoir-react";

import { DownArrowIcon } from "./DownArrowIcon";
import { ArrowStylePanel } from "./ArrowStylePanel";
import { iconSize } from "./constants";
import { useAnnotationsContext } from "../../context/annotations";
import { Arrow, createArrow } from "@linkurious/text-annotations";
import { useAppContext } from "../../context";

export const ArrowDropdown: FC = () => {
  const {
    editor,
    annotations,
    setAnnotations,
    setCurrentAnnotation,
    arrowStyle,
  } = useAnnotationsContext();
  const { ogma } = useAppContext();

  const onClick = useCallback(() => {
    ogma.events.once("click", (evt) => {
      requestAnimationFrame(() => {
        const start = ogma.view.screenToGraphCoordinates(evt);
        // TODO: pass the options here
        editor.startArrow(start.x, start.y);
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
      dropdownRender={() => <ArrowStylePanel />}
    >
      <ArrowRight height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
