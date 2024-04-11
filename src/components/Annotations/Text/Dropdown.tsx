import { FC, useCallback } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { Text as TextIcon } from "iconoir-react";
import { TextStylePanel } from "./StylePanel";
import { useAnnotationsContext, useAppContext } from "../../../context";
import { iconSize } from "../constants";
import { NavArrowDown } from "iconoir-react";
import { createText, isText } from "@linkurious/annotations-control";

interface TextDropdownProps {}

export const TextDropdown: FC<TextDropdownProps> = () => {
  const { editor, textStyle, setCurrentAnnotation, currentAnnotation } =
    useAnnotationsContext();
  const { ogma } = useAppContext();

  const isActive = currentAnnotation && isText(currentAnnotation);

  const onClick = useCallback(() => {
    // set button active
    ogma.events
      .once("keyup", (evt) => {
        // if (evt.code === 27) {
        // }
      })
      .once("mousedown", (evt) => {
        requestAnimationFrame(() => {
          const { x, y } = ogma.view.screenToGraphCoordinates(evt);
          const text = createText(x, y, 0, 0, "", textStyle);
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
      type={isActive ? "primary" : "default"}
      dropdownRender={() => <TextStylePanel />}
    >
      <TextIcon height={iconSize} width={iconSize} fr="" />
    </Dropdown.Button>
  );
};
