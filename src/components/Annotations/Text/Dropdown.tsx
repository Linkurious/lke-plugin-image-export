import { FC, useCallback } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { Text as TextIcon } from "iconoir-react";
import { TextStylePanel } from "./StylePanel";
import { useAnnotationsContext, useAppContext } from "../../../context";
import { iconSize } from "../constants";
import { NavArrowDown } from "iconoir-react";
import { createArrow, createText } from "@linkurious/annotations-control";

interface TextDropdownProps {}

export const TextDropdown: FC<TextDropdownProps> = () => {
  const { editor, textStyle, setCurrentAnnotation } = useAnnotationsContext();
  const { ogma } = useAppContext();

  const onClick = useCallback(() => {
    console.log("start new text annotation", editor);
    // set button active
    ogma.events
      .once("keyup", (evt) => {
        if (evt.code === 27) {
          console.log("stop text annotation");
        }
      })
      .once("mousedown", (evt) => {
        requestAnimationFrame(() => {
          const { x, y } = ogma.view.screenToGraphCoordinates(evt);
          const text = createText(x, y, 0, 0, "Text", textStyle);
          //control.add(arrow);
          editor.startText(x, y, text);
          setCurrentAnnotation(text);
        });
      });
  }, [editor, ogma, textStyle]);

  return (
    <Dropdown.Button
      title="Text box"
      size="small"
      className="annotations-text--dropdown"
      trigger={["click"]}
      onClick={onClick}
      icon={<NavArrowDown width={12} />}
      dropdownRender={() => <TextStylePanel />}
    >
      <TextIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
