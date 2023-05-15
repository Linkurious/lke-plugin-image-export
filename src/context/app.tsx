import { LKOgma } from "@linkurious/ogma-linkurious-parser";
import { IOgmaConfig, PopulatedVisualization } from "@linkurious/rest-client";
import { StyleRule } from "@linkurious/ogma";
import {
  createContext,
  useContext,
  Context,
  useEffect,
  useState,
  ReactElement,
} from "react";

import * as api from "../api";
import type { GraphSchema } from "../api";
import type { FormatType } from "../types/formats";
import { formats } from "../constants";
import type { Bounds } from "../utils";

interface IAppContext {
  visualisation: PopulatedVisualization;
  configuration: IOgmaConfig;
  graphSchema?: GraphSchema;
  format: FormatType;
  setFormat: (format: FormatType) => void;
  loading: boolean;
  ogma: LKOgma;
  setOgma: (ogma: LKOgma) => void;
  boundingBox: Bounds;
  setBoundingBox: (boundingBox: Bounds) => void;

  // scaling to fit the clipping window
  graphScale: number;
  setGraphScale: (scale: number) => void;
  scalingStyleRule: StyleRule;
  setScalingStyleRule: (rule: StyleRule) => void;
  scalingStyleEnabled: boolean;
  setScalingStyleEnabled: (enabled: boolean) => void;

  // shared state
  textsVisible: boolean;
  setTextsVisible: (textsVisible: boolean) => void;

  background: boolean;
  setBackground: (background: boolean) => void;

  // TODO: export configuration to the app
  error: Error | null;
}

export const AppContext = createContext(
  undefined
) as unknown as Context<IAppContext>;

export const useAppContext = () => useContext<IAppContext>(AppContext);

interface Props {
  children: ReactElement;
}

/**
 * This is the hook that allows you to access the Ogma instance.
 * It should only be used in the context of the `Ogma` component.
 */
export const AppContextProvider = ({ children }: Props) => {
  const [visualisation, setVis] = useState<PopulatedVisualization>();
  const [loading, setLoading] = useState(true);
  const [configuration, setConfig] = useState<IOgmaConfig>();
  const [graphSchema, setGraphSchema] = useState<GraphSchema>();
  const [format, setFormat] = useState<FormatType>(formats[0]);
  const [error, setError] = useState<Error | null>(null);

  const [ogma, setOgma] = useState<LKOgma>();
  const [boundingBox, setBoundingBox] = useState<Bounds>([
    Infinity,
    Infinity,
    -Infinity,
    -Infinity,
  ]);
  const [textsVisible, setTextsVisible] = useState(true);
  const [background, setBackground] = useState(true);
  const [graphScale, setGraphScale] = useState(1);
  const [scalingStyleRule, setScalingStyleRule] = useState<StyleRule>();
  const [scalingStyleEnabled, setScalingStyleEnabled] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getVisualisation(),
      api.getConfiguration(),
      api.getGraphSchema(),
    ])
      .then(([visualisation, configuration, graphSchema]) => {
        setVis(visualisation);
        setConfig(configuration);
        setGraphSchema(graphSchema);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, []);

  return (
    <AppContext.Provider
      value={
        {
          visualisation,
          configuration,
          graphSchema,
          loading,
          ogma,
          setOgma,
          format,
          setFormat,
          boundingBox,
          setBoundingBox,
          textsVisible,
          setTextsVisible,
          background,
          setBackground,
          graphScale,
          setGraphScale,
          scalingStyleRule,
          setScalingStyleRule,
          scalingStyleEnabled,
          setScalingStyleEnabled,
          error,
        } as IAppContext
      }
    >
      {children}
    </AppContext.Provider>
  );
};
