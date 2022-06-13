import React, {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
} from "react";
import { LKOgma as OgmaLib } from "@linkurious/ogma-linkurious-parser";
import { IOgmaConfig, PopulatedVisualization } from "@linkurious/rest-client";
import { useAppContext } from "../context";
import { BoundingBox, Layer, Overlay } from "@linkurious/ogma";

interface OgmaProps {
  options?: Partial<IOgmaConfig>;
  onReady?: (ogma: OgmaLib) => void;
  graph?: PopulatedVisualization;
  children?: ReactNode;
}

const defaultOptions = {};

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = (
  { options = defaultOptions, children, graph, onReady }: OgmaProps,
  ref?: Ref<OgmaLib>
) => {
  const [ready, setReady] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [graphData, setGraphData] = useState<PopulatedVisualization>();
  const [viewCenter, setViewCenter] = useState<{ x: number, y: number }>();
  const [layers, setLayers] = useState<Layer[]>();




  const { ogma, setBoundingBox, boundingBox, format } = useAppContext();

  useImperativeHandle(ref, () => ogma as OgmaLib, [ogma]);

  useEffect(() => {
    if (container) {
      const instance = new OgmaLib(options);
      instance.setContainer(container);
      setReady(true);
      if (onReady) onReady(instance);
    }
  }, [container]);


  useEffect(() => {
    if (!ogma || !format || !layers || !boundingBox) return;
    console.log('format change, update layers', format)
    const height = ogma.getContainer()?.offsetHeight || 0;
    const width = ogma.getContainer()?.offsetWidth || 0;
    let min, max;
    if (format.value) {
      // fixed size
      min = {
        x: Math.max(0, (width - format.value.width) /2),
        y: Math.max(0, (height - format.value.height) / 2)
      };
      max = {
        x: (width + format.value.width) /2,
        y: (height + format.value.height) / 2
      };
    } else {
      // full size
      const {minX, minY, maxX, maxY } = boundingBox;
      min = ogma.view.graphToScreenCoordinates({x: minX,y: minY})
      max = ogma.view.graphToScreenCoordinates({x: maxX,y: maxY})
    }
    const heightTop = min.y;
    const heightBottom = Math.max(0, height - max.y);
    const offsetBottom = height - heightBottom;
    const widthLeft = min.x;
    const widthRight = Math.max(0 , width - max.x);
    const offsetRight = width - widthRight;

    layers[0].element.style.width = `100%`;
    layers[0].element.style.height = `${heightTop}px`;
    layers[1].element.style.width = `100%`;
    layers[1].element.style.height = `${heightBottom}px`;
    layers[1].element.style.top = `${offsetBottom}px`;

    layers[2].element.style.width = `${widthLeft}px`;
    layers[2].element.style.height = `${height - heightBottom - heightTop}px`;
    layers[2].element.style.top = `${heightTop}px`;

    layers[3].element.style.width = `${widthRight}px`;
    layers[3].element.style.left = `${offsetRight}px`;
    layers[3].element.style.height = `${height - heightBottom - heightTop}px`;
    layers[3].element.style.top = `${heightTop}px`;

  }, [format, ogma, viewCenter, boundingBox, layers]);

  // resize handler
  useLayoutEffect(() => {
    const updateSize = () => ogma?.view.forceResize();
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (ogma) {
      if (graph && ogma && graph !== graphData) {
        setGraphData(graph);
        ogma.initVisualization(graph);
        ogma.view.locateGraph();
        ogma.view.forceResize();
        
        setLayers(new Array(4).fill(0).map((_, i) => {
          const div = document.createElement('div');
          div.classList.add('overlay');
          return ogma.layers.addLayer(
           div,
            // position: { x: 0, y: 0 },
            // size: { width: 0, height: 0 }
          );
        }))
      }
    }
  }, [graph, options, ogma]);

  useEffect(() => {
    const updateBbox = () => {
      if (ogma) setBoundingBox(ogma.view.getGraphBoundingBox());
    };
    const updateCenter = () => {
      if (ogma) setViewCenter(ogma.view.getCenter());
    };
    if (ogma) {
      ogma.events.on(
        ["addNodes", "addEdges", "layoutEnd", "nodesDragEnd"],
        updateBbox
      );
      ogma.events.on('cameraMove', updateCenter)
    }
    return () => {
      ogma?.events.off(updateBbox);
      ogma?.events.off(updateCenter);

    };
  }, [ogma]);

  return (
    <div
      className="visualisation--container"
      ref={(containerRef) => setContainer(containerRef)}
    >
      {ready && children}
    </div>
  );
};

export const Ogma = forwardRef(OgmaComponent);
