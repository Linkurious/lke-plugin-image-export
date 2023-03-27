import { FC, useRef } from "react";
import "./Control.css";
import { useAppContext } from "../../context";
import Button from "antd/es/button/button";
import { TextDropdown } from "./Text/Dropdown";
import { ArrowDropDown } from "./Arrow/Dropdown";

interface AnnotationsControlProps {}

export const AnnotationsControl: FC<AnnotationsControlProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="annotations-control" ref={containerRef}>
      <Button.Group>
        <TextDropdown />
        <ArrowDropDown />
      </Button.Group>
    </div>
  );
};
