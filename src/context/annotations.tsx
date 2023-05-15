import {
  createContext,
  useContext,
  Context,
  useState,
  ReactElement,
  useReducer,
} from "react";
import {
  AnnotationCollection,
  AnnotationFeature,
  ArrowStyles,
  TextStyle,
  Control as AnnotationsEditor,
  Annotation,
} from "@linkurious/annotations-control";
import {
  defaultArrowStyle,
  defaultTextStyle,
} from "../components/Annotations/constants";

interface IAnnotationsContext {
  annotations: AnnotationCollection;
  updateAnnotations: React.Dispatch<AnnotationAction>;
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
) as unknown as Context<IAnnotationsContext>;

export const useAnnotationsContext = () =>
  useContext<IAnnotationsContext>(AnnotationsContext);

interface Props {
  children: ReactElement;
}

type AnnotationActionType = "add" | "remove" | "update";
type AnnotationAction = {
  type: AnnotationActionType;
  payload: Annotation;
};

const annotatationsReducer = (
  state: AnnotationCollection,
  action: AnnotationAction
) => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "remove":
      return {
        ...state,
        features: state.features.filter((a) => a.id !== action.payload.id),
      };
    case "update":
      return {
        ...state,
        features: state.features.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    default:
      return state;
  }
};

export const AnnotationsContextProvider = ({ children }: Props) => {
  const [annotations, updateAnnotations] = useReducer(annotatationsReducer, {
    type: "FeatureCollection",
    features: [],
  });
  const [currentAnnotation, setCurrentAnnotation] =
    useState<AnnotationFeature | null>(null);
  const [arrowStyle, setArrowStyle] = useState<ArrowStyles>(defaultArrowStyle);
  const [textStyle, setTextStyle] = useState<TextStyle>(defaultTextStyle);
  const [editor, setEditor] = useState<AnnotationsEditor>();

  return (
    <AnnotationsContext.Provider
      value={
        {
          annotations,
          updateAnnotations,

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
