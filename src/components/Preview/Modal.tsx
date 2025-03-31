import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Progress from "antd/es/progress";
import { ModalFuncProps } from "antd/es/modal";
import { FormatType, ExportType } from "../../types/formats";
import { useAnnotationsContext, useAppContext } from "../../context";
import { svgElementToString } from "@linkurious/ogma-export-stitch";
import { Size } from "@linkurious/ogma";
import embedFonts from "@linkurious/svg-font-embedder";
import { ImageViewer } from "../ImageViewer";
import { Footer } from "./Footer";
import { destroyRule, scaleGraph, stringToSVGElement } from "../../utils";
import {
  addCheckerboard,
  addClipShape,
  addTransformGroup,
  bringTextsToTop,
  embedImages,
  exportClipped,
  exportOrginalSize,
} from "../../utils/svg";
import {
  handleDownload,
  sendExportImageTelemetryEvent,
} from "../../utils/download";
import "./Modal.css";

// TODO: add that, and through the webworker
//import { optimize } from "svgo/dist/svgo.browser";

interface Props extends ModalFuncProps {
  format: FormatType;
  onCancel: () => void;
}

export const Modal: FC<Props> = ({ open, onCancel, onOk }) => {
  const {
    ogma,
    visualisation,
    textsVisible,
    format,
    graphScale,
    scalingStyleRule,
    setScalingStyleRule,
    background,
    setBackground,
  } = useAppContext();
  const { annotations, editor } = useAnnotationsContext();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!open || !ogma || image) return;

    const prepareDownload = async () => {
      setLoading(true);
      ogma.getSelectedEdges().setSelected(false);
      ogma.getSelectedNodes().setSelected(false);

      editor.unselect();
      await scaleGraph(ogma, 1 / graphScale, editor);
      const scaleStyleDef = scalingStyleRule.getDefinition();

      await destroyRule(scalingStyleRule, ogma);

      const exportOptions = {
        texts: textsVisible,
      };
      let res = stringToSVGElement(
        format.value === undefined
          ? await exportOrginalSize(ogma, annotations, exportOptions)
          : await exportClipped(
              ogma,
              format.value.width,
              format.value.height,
              exportOptions
            )
      );
      setProgress(50);

      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const width = parseFloat(res.getAttribute("width")!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const height = parseFloat(res.getAttribute("height")!);
      setSize({ width, height });

      // TODO: restrict these manipulations only to preview, do not export
      addClipShape(res, width, height);
      addCheckerboard(res);
      addTransformGroup(res);
      bringTextsToTop(res);

      console.time("embed images");
      res = await embedImages(res);
      console.timeEnd("embed images");

      const svgString = svgElementToString(res);
      console.time("embed fonts");
      const result = embedFonts(svgString);
      console.timeEnd("embed fonts");
      setImage(result);

      // replace the rule with the original one
      const rule = ogma.styles.addRule(scaleStyleDef);
      setScalingStyleRule(rule);
      await scaleGraph(ogma, graphScale, editor);
    };

    prepareDownload();

    // listen to escape key to cancel
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keyup", onKeyUp);

    return () => {
      if (open) setImage("");
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [open, editor, ogma]);

  // apply the background color to the SVG
  useEffect(() => {
    if (!image) return;
    const el = stringToSVGElement(image);
    setImage(svgElementToString(el));
  }, [background, image]);

  const onDownload = async (exportType: ExportType) => {
    const el = stringToSVGElement(image as string);
    const bg = el.querySelector(".ogma-svg-background") as SVGRectElement;
    bg!.setAttribute("fill-opacity", background ? "1" : "0");
    // We send a telemetry event if the access to this app is as an LKE module and not as a plugin
    const accessFromModules = window.location.pathname.includes("modules");
    if (accessFromModules) {
      sendExportImageTelemetryEvent(exportType.label, format.label);
    }
    await handleDownload(el, exportType, visualisation.title);
    if (onOk) onOk();
  };

  const footer = image ? (
    <Footer
      setBackground={setBackground}
      background={background}
      onDownload={onDownload}
      onCancel={onCancel}
      loading={loading}
      size={size}
      image={image}
    />
  ) : null;

  const className = open ? "preview--screen open" : "preview--screen";
  return createPortal(
    <div className={className}>
      <div className="preview--container">
        {loading && (
          <Progress
            className="preview--progressbar"
            percent={Math.round(progress)}
            size="small"
          />
        )}
        {image && (
          <ImageViewer svg={image} size={size} background={background} />
        )}
        {footer}
      </div>
    </div>,
    document.body
  );
};
