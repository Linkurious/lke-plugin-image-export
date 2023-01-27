import React, { FC, useCallback, useState } from "react";
import { Dropdown } from "antd";
import { DownArrowIcon } from "./icons";
import { Text as TextIcon } from "iconoir-react";
import { createText } from "@linkurious/annotations-control";
import { TextStylePanel } from "./TextStylePanel";
import { iconSize } from "./constants";
import { useAnnotationsContext } from "../../context/annotations";
import { useAppContext } from "../../context";

export const TextDropdown: FC = () => {
  const {
    editor,
    annotations,
    textStyle,
    currentAnnotation,
    setCurrentAnnotation,
  } = useAnnotationsContext();
  const { ogma } = useAppContext();
  const [isDrawing, setIsDrawing] = useState(false);

  const onClick = useCallback(() => {
    console.log("start drawing text");
    if (isDrawing) return;
    setIsDrawing(true);
    ogma.events
      .once("keyup", (evt) => {
        if (evt.code === 27) {
          setCurrentAnnotation(null);
          setIsDrawing(false);
        }
      })
      .once("mousedown", (evt) => {
        requestAnimationFrame(() => {
          const { x, y } = ogma.view.screenToGraphCoordinates(evt);
          const text = createText(x, y, 0, 0, "", textStyle);
          editor.startText(x, y, text);
          setCurrentAnnotation(text);
        });
      });
  }, [editor, annotations, textStyle, isDrawing]);

  return (
    <Dropdown.Button
      size="small"
      className="annotations-text--dropdown"
      icon={<DownArrowIcon />}
      menu={{ items: [] }}
      onClick={onClick}
      trigger={["click"]}
      type={
        currentAnnotation && currentAnnotation.properties.type === "text"
          ? "primary"
          : "default"
      }
      dropdownRender={() => <TextStylePanel />}
    >
      <TextIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
