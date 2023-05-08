import { FC, useEffect, useState } from "react";
import Progress from "antd/es/progress";
import UIModal, { ModalFuncProps } from "antd/es/modal";

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
import { handleDownload } from "../../utils/download";
// TODO: add that, and through the webworker
//import { optimize } from "svgo/dist/svgo.browser";

interface Props extends ModalFuncProps {
  format: FormatType;
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
      await scaleGraph(ogma, 1 / graphScale);
      const scaleStyleDef = scalingStyleRule.getDefinition();

      await destroyRule(scalingStyleRule, ogma);

      const exportOptions = {
        texts: textsVisible,
      };
      // @ts-ignore
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

      setLoading(false);
      const width = parseFloat(res.getAttribute("width")!);
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
      scaleGraph(ogma, graphScale);
    };

    prepareDownload();

    return () => {
      if (open) setImage("");
    };
  }, [open, editor, ogma, annotations]);

  // apply the background color to the SVG
  useEffect(() => {
    if (!image) return;
    const el = stringToSVGElement(image);
    setImage(svgElementToString(el));
  }, [background, image]);

  const onDownload = async (format: ExportType) => {
    const el = stringToSVGElement(image as string);
    const bg = el.querySelector(".ogma-svg-background") as SVGRectElement;
    bg!.setAttribute("fill-opacity", background ? "1" : "0");
    await handleDownload(el, format, visualisation.title);
    if (onOk) onOk();
  };

  return (
    <UIModal
      title="Preview"
      className="preview--modal"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={"80vw"}
      footer={
        image && (
          <Footer
            setBackground={setBackground}
            background={background}
            onDownload={onDownload}
            loading={loading}
            size={size}
            image={image}
          />
        )
      }
    >
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
      </div>
    </UIModal>
  );
};
