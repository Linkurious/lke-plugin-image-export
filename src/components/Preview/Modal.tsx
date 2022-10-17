import React, { FC, useEffect, useState } from "react";
import { Modal as UIModal, ModalFuncProps, Progress } from "antd";
import { FormatType, ExportType } from "../../types/formats";
import { useAppContext } from "../../context";
import {
  svg,
  svgElementToString,
  svgToPng,
} from "@linkurious/ogma-export-stitch";
import Ogma, { Size } from "@linkurious/ogma";
import embedFonts from "@linkurious/svg-font-embedder";
import { ImageViewer } from "../ImageViewer";
import { Footer } from "./Footer";
import { downloadBlob, scaleGraph, stringToSVGElement } from "../../utils";
import {
  addCheckerboard,
  addClipShape,
  addTransformGroup,
  embedImages,
} from "../../utils/svg";
import { fullSizeMargin } from "../../constants";
import { jsPDF } from "jspdf";
import "svg2pdf.js";

// TODO: add that, and through the webworker
//import { optimize } from "svgo/dist/svgo.browser";

interface Props extends ModalFuncProps {
  format: FormatType;
}

export const Modal: FC<Props> = ({ visible, onCancel, onOk }) => {
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
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!visible || !ogma || image) return;

    setLoading(true);
    ogma.getSelectedEdges().setSelected(false);
    ogma.getSelectedNodes().setSelected(false);

    scaleGraph(ogma, 1 / graphScale);
    const scaleStyleDef = scalingStyleRule.getDefinition();

    scalingStyleRule
      .destroy()
      .then(() =>
        svg(ogma as unknown as Ogma)
          .setOptions({
            texts: textsVisible,
          })
          .on("start", () => setProgress(0))
          .on("progress", (progress) => setProgress(progress))
          .run({
            fullSize: format.value === undefined,
            margin: format.value === undefined ? fullSizeMargin : 0,
            width: format.value ? format.value.width : 0,
            height: format.value ? format.value.height : 0,
          })
      )
      .then(async (res) => {
        setLoading(false);
        const width = parseFloat(res.getAttribute("width")!);
        const height = parseFloat(res.getAttribute("height")!);
        setSize({ width, height });

        // TODO: restrict these manipulations only to preview, do not export
        addClipShape(res, width, height);
        addCheckerboard(res);
        addTransformGroup(res);

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
      });

    return () => {
      if (visible) setImage("");
    };
  }, [visible]);

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
    if (format.label === "PDF") {
      const svg = el.cloneNode(true) as SVGSVGElement;
      const svgWidth = parseInt(svg.getAttribute("width") as string);
      const svgHeight = parseInt(svg.getAttribute("height") as string);
      const pdf = new jsPDF({
        format: [svgWidth, svgHeight],
        orientation: svgWidth > svgHeight ? "landscape" : "portrait",
        unit: "pt",
        compress: true,
      });
      const margin = 0;
      const pageWidth = pdf.getPageWidth() - margin * 2;
      const pageHeight = pdf.getPageHeight() - margin * 2;

      // vertical cursor
      let y = margin;
      // fitting ratio canvas to page
      let ratio = 1 / Math.max(svgWidth / pageWidth, svgHeight / pageHeight);
      // seems like big sizes breaks it
      const width = svgWidth * ratio;
      const height = svgHeight * ratio;
      // resize SVG
      el.setAttribute("width", width.toString());
      el.setAttribute("height", height.toString());
      // fit the contents of SVG
      svg.setAttribute("viewBox", `0 0 ${width / ratio} ${height / ratio}`);

      await pdf.svg(svg, { x: margin, y, width, height });
      await pdf.save(`${visualisation.title}.pdf`);
    } else {
      const imgDownload = svgElementToString(el);

      if (format.label === "SVG") {
        downloadBlob(
          imgDownload,
          `${visualisation.title}.svg`,
          "image/svg+xml"
        );
      } else if (format.label === "PNG") {
        const data = await svgToPng(el);
        downloadBlob(data, `${visualisation.title}.png`, "image/png");
      }
    }
    if (onOk) onOk();
  };

  return (
    <UIModal
      title="Preview"
      className="preview--modal"
      visible={visible}
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
