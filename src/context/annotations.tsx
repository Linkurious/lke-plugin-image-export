import {
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
} from "@linkurious/annotations-control";
import {
  colors,
  fontFamilies,
  rgbaToString,
  fontSizes,
  TRANSPARENT,
  BLACK,
} from "../components/Annotations/constants";

interface IAnnotationsContext {
  annotations: AnnotationCollection;
  setAnnotations: (annotations: AnnotationCollection) => void;
  currentAnnotation: AnnotationFeature | null;
  setCurrentAnnotation: (annotation: AnnotationFeature | null) => void;
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
    useState<AnnotationFeature | null>(null);
  const [arrowStyle, setArrowStyle] = useState<ArrowStyles>({
    head: "arrow",
    strokeColor: colors[1],
    strokeWidth: 5,
  });
  const [textStyle, setTextStyle] = useState<TextStyle>({
    font: fontFamilies["Sans-serif"],
    fontSize: fontSizes[5].toString(),
    color: BLACK,
    strokeType: TRANSPARENT,
    background: TRANSPARENT,
  });
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