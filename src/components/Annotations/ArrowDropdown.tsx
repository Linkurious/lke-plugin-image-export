import React, { FC, useCallback } from "react";
import { Dropdown } from "antd";
import { ArrowRight } from "iconoir-react";

import { DownArrowIcon } from "./DownArrowIcon";
import { ArrowStylePanel } from "./ArrowStylePanel";
import { iconSize } from "./constants";
import { useAnnotationsContext } from "./context";
import { Arrow } from "@linkurious/text-annotations";

export const ArrowDropdown: FC = () => {
  const {
    editor,
    annotations,
    setAnnotations,
    setCurrentAnnotation,
    arrowStyle,
  } = useAnnotationsContext();

  const onClick = useCallback(() => {
    console.log("add arrow");
    const newArrow: Arrow = {
      id: annotations.features.length.toString(),
      properties: {
        type: "arrow",
        style: { ...arrowStyle },
      },
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [0, 0],
          [0, 0],
        ],
      },
    };
    console.log(newArrow);
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
