import React, {
  createContext,
  useContext,
  Context,
  useState,
  ReactElement,
} from "react";
import {
  AnnotationCollection,
  AnnotationFeature,
  ArrowStyles,
  TextStyle,
  Control as AnnotationsEditor,
} from "@linkurious/text-annotations";
import { colors } from "./constants";

interface IAnnotationsContext {
  annotations: AnnotationCollection;
  setAnnotations: (annotations: AnnotationCollection) => void;
  currentAnnotation?: AnnotationFeature;
  setCurrentAnnotation: (annotation: AnnotationFeature) => void;
  arrowStyle: ArrowStyles;
  setArrowStyle: (arrowStyle: ArrowStyles) => void;
  textStyle: TextStyle;
  setTextStyle: (textStyle: TextStyle) => void;

  editor: AnnotationsEditor;
  setEditor: (editor: AnnotationsEditor) => void;
}

export function createAnnotationsContext() {
  return createContext<IAnnotationsContext | null>(null);
}

export const AnnotationsContext = createContext(
  undefined
) as any as Context<IAnnotationsContext>;

export const useAnnotationsContext = () =>
  useContext<IAnnotationsContext>(AnnotationsContext);

interface Props {
  children: ReactElement;
}

export const AnnotationsContextProvider = ({ children }: Props) => {
  const [annotations, setAnnotations] = useState<AnnotationCollection>({
    type: "FeatureCollection",
    features: [],
  });
  const [currentAnnotation, setCurrentAnnotation] =
    useState<AnnotationFeature>();
  const [arrowStyle, setArrowStyle] = useState<ArrowStyles>({
    head: "arrow",
    strokeColor: colors[0],
    strokeWidth: 2,
  });
  const [textStyle, setTextStyle] = useState<TextStyle>();
  const [editor, setEditor] = useState<AnnotationsEditor>();

  return (
    <AnnotationsContext.Provider
      value={
        {
          annotations,
          setAnnotations,

          currentAnnotation,
          setCurrentAnnotation,

          textStyle,
          setTextStyle,
          arrowStyle,
          setArrowStyle,

          editor,
          setEditor,
        } as IAnnotationsContext
      }
    >
      {children}
    </AnnotationsContext.Provider>
  );
};
