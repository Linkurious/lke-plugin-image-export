import React, { FC } from "react";
import { AnnotationsContextProvider } from "../../context/annotations";
import { AnnotationsControl as Control } from "./Control";

export const AnnotationsControl: FC = () => {
  return (
    <AnnotationsContextProvider>
      <Control />
    </AnnotationsContextProvider>
  );
};
