import React, { FC, useCallback } from "react";
import { Dropdown } from "antd";
import { DownArrowIcon } from "./icons";
import { Text as TextIcon } from "iconoir-react";
import { createText } from "@linkurious/annotations-control";
import { TextStylePanel } from "./TextStylePanel";
import { iconSize } from "./constants";
import { useAnnotationsContext } from "../../context/annotations";
import { useAppContext } from "../../context";

export const TextDropdown: FC = () => {
  const { editor, annotations, textStyle, currentAnnotation } =
    useAnnotationsContext();
  const { ogma } = useAppContext();
  const onClick = useCallback(() => {
    ogma.events.once("mouseup", (evt) => {
      requestAnimationFrame(() => {
        const { x, y } = ogma.view.screenToGraphCoordinates(evt);
        console.log("textStyle", textStyle);
        const text = createText(x, y, 0, 0, "", textStyle);
        editor.startText(x, y, text);
      });
    });
  }, [editor, annotations, textStyle]);
  return (
    <Dropdown.Button
      size="small"
      className="annotations-text--dropdown"
      icon={<DownArrowIcon />}
      menu={{ items: [] }}
      onClick={onClick}
      trigger={["click"]}
      type={
        currentAnnotation?.properties.type === "text" ? "primary" : "default"
      }
      dropdownRender={() => <TextStylePanel />}
    >
      <TextIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
