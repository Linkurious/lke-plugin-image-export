import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import { Button } from "antd";
import { stopPropagation } from "../../utils";
import { Control as AnnotationsEditor } from "@linkurious/annotations-control";

import { useAppContext } from "../../context";
import { useAnnotationsContext } from "../../context/annotations";

import { TextDropdown } from "./TextDropdown";
import { ArrowDropdown } from "./ArrowDropdown";

import "@linkurious/annotations-control/style.css";
import "./Control.css";

export const AnnotationsControl: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ogma } = useAppContext();
  const { setEditor } = useAnnotationsContext();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", stopPropagation);
    }
  }, [containerRef]);

  useEffect(() => {
    if (ogma) {
      const newEditor = new AnnotationsEditor(ogma);
      setEditor(newEditor);
    }
  }, [ogma]);

  return (
    <div className="annotations-control" ref={containerRef}>
      <Button.Group>
        <TextDropdown />
        <ArrowDropdown />
      </Button.Group>
    </div>
  );
};
