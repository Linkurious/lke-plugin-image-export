import { LKOgma } from "@linkurious/ogma-linkurious-parser";
import { IOgmaConfig, PopulatedVisualization } from "@linkurious/rest-client";
import { BoundingBox } from "ogma";
import React, {
  createContext,
  useContext,
  Context,
  useEffect,
  useState,
  ReactElement,
} from "react";

import * as api from "../api";

interface IAppContext {
  visualisation: PopulatedVisualization;
  configuration: IOgmaConfig;
  loading: boolean;
  ogma: LKOgma;
  setOgma: (ogma: LKOgma) => void;
  boundingBox: BoundingBox;
  setBoundingBox: (boundingBox: BoundingBox) => void;

  // TODO: export configuration to the app
}

export function createAppContext<ND = unknown, ED = unknown>() {
  return createContext<IAppContext | null>(null);
}

export const AppContext = createContext(
  undefined
) as any as Context<IAppContext>;

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
  const [ogma, setOgma] = useState<LKOgma>();
  const [boundingBox, setBoundingBox] = useState<BoundingBox>();

  useEffect(() => {
    Promise.all([api.getVisualisation(), api.getConfiguration()]).then(
      ([visualisation, configuration]) => {
        setVis(visualisation);
        setConfig(configuration);
        setLoading(false);
      }
    );
  }, []);

  return (
    <AppContext.Provider
      value={
        {
          visualisation,
          configuration,
          loading,
          ogma,
          setOgma,
          boundingBox,
          setBoundingBox,
        } as IAppContext
      }
    >
      {children}
    </AppContext.Provider>
  );
};
