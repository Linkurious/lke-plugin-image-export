import { FC, useRef, useEffect } from "react";
import {
  Control as AnnotationsEditor,
  isArrow,
  isText,
} from "@linkurious/annotations-control";
import "@linkurious/annotations-control/style.css";
import "./Control.css";
import { useAppContext, useAnnotationsContext } from "../../context";

import Button from "antd/es/button/button";
import { TextDropdown } from "./Text/Dropdown";
import { ArrowDropDown } from "./Arrow/Dropdown";

interface AnnotationsControlProps {}

export const AnnotationsControl: FC<AnnotationsControlProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ogma } = useAppContext();
  const {
    editor,
    setEditor,
    arrowStyle,
    setArrowStyle,
    textStyle,
    setTextStyle,
    currentAnnotation,
    setCurrentAnnotation,
    annotations,
    setAnnotations,
  } = useAnnotationsContext();
  useEffect(() => {
    if (ogma) {
      const newEditor = new AnnotationsEditor(ogma, {
        textPlaceholder: "Your text...",
      });
      newEditor
        .on("select", (annotation) => {
          // read back the current options from the selected annotation
          if (isArrow(annotation)) {
            setArrowStyle({
              ...arrowStyle,
              ...(annotation.properties.style || {}),
            });
          } else if (isText(annotation)) {
            setTextStyle({
              ...textStyle,
              ...(annotation.properties.style || {}),
            });
          }
          setCurrentAnnotation(annotation);
        })
        .on("unselect", () => {
          // TODO: maybe set back the styles to the default options
          setCurrentAnnotation(null);
        })
        .on("add", (annotation) => {
          setAnnotations({
            ...annotations,
            features: [...annotations.features, annotation],
          });
        })
        .on("remove", (annotation) => {
          console.log({ annotation });
          setAnnotations({
            ...annotations,
            features: annotations.features.filter(
              (a) => a.id !== annotation.id
            ),
          });
        });
      setEditor(newEditor);
    }
    return () => {
      editor?.destroy();
    };
  }, [ogma]);

  // update the style of the current arrow annotation when the style changes
  useEffect(() => {
    console.log("arrow style changed", arrowStyle, currentAnnotation);
    if (
      editor &&
      currentAnnotation &&
      currentAnnotation?.properties.type === "arrow"
    ) {
      editor.updateStyle(currentAnnotation.id, arrowStyle);
    }
  }, [editor, arrowStyle]);

  // update the style of the current text annotation when the style changes
  useEffect(() => {
    if (
      editor &&
      currentAnnotation &&
      currentAnnotation?.properties.type === "text"
    ) {
      editor.updateStyle(currentAnnotation.id, textStyle);
    }
  }, [editor, textStyle]);

  return (
    <div className="annotations-control" ref={containerRef}>
      <Button.Group>
        <TextDropdown />
        <ArrowDropDown />
      </Button.Group>
    </div>
  );
};
