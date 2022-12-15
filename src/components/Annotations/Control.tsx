import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import { Button } from "antd";
import Ogma from "@linkurious/ogma";
import { SubnodeOutlined } from "@ant-design/icons";
import { stopPropagation } from "../../utils";
import { Control } from "@linkurious/text-annotations";
import { Text as TextIcon, MapsArrowDiagonal, ArrowRight } from "iconoir-react";

import "./Control.css";
import { useAppContext } from "../../context";

interface Props {}

export const AnnotationsControl: FC<Props> = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ogma } = useAppContext();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", stopPropagation);
    }
  }, [containerRef]);

  useEffect(() => {
    if (ogma) {
      const control = new Control(ogma);
    }
  }, [ogma]);

  return (
    <div className="annotations-control" ref={containerRef}>
      <Button.Group>
        <Button icon={<TextIcon height={22} width={22} fr="" />} size="small" />
        <Button
          icon={<ArrowRight height={22} width={22} fr="" />}
          size="small"
        />
      </Button.Group>
    </div>
  );
};
