import React, { FC, useCallback, useEffect, useRef } from "react";
import { Button } from "antd";
import { stopPropagation } from "../../utils";
import {
  Control as AnnotationsEditor,
  isArrow,
  isText,
} from "@linkurious/annotations-control";

import { useAppContext } from "../../context";
import { useAnnotationsContext } from "../../context/annotations";

import { TextDropdown } from "./TextDropdown";
import { ArrowDropdown } from "./ArrowDropdown";

import "@linkurious/annotations-control/style.css";
import "./Control.css";

export const AnnotationsControl: FC = () => {
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
  } = useAnnotationsContext();

  // stop propagation of mouse events to the ogma canvas
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", stopPropagation);
    }
  }, [containerRef]);

  // create the annotations editor when the ogma instance is available
  useEffect(() => {
    if (ogma) {
      const newEditor = new AnnotationsEditor(ogma);
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
          // TODO: maybe set back to the default options
          setCurrentAnnotation(null);
        });
      setEditor(newEditor);
    }
  }, [ogma]);

  // update the style of the current arrow annotation when the style changes
  useEffect(() => {
    console.log("arrow style changed", currentAnnotation);
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
    console.log("text style changed", currentAnnotation);
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
        <ArrowDropdown />
      </Button.Group>
    </div>
  );
};
