import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Menu,
  Modal as UIModal,
  ModalFuncProps,
  Progress,
  Dropdown,
  Switch,
} from "antd";
import { FormatType, ExportType } from "../../types/formats";
import { ExportTypes } from "../../constants";
import { useAppContext } from "../../context";
import {
  svg,
  svgElementToString,
  svgToPng,
} from "@linkurious/ogma-export-stitch";
import { Size } from "@linkurious/ogma";
import embedFonts from "@linkurious/svg-font-embedder";
import { ImageViewer } from "../ImageViewer";
import { DownOutlined } from "@ant-design/icons";
import { Footer } from "./Footer";
import {
  formatSize,
  downloadBlob,
  scaleGraph,
  stringToSVGElement,
} from "../../utils";
import {
  addCheckerboard,
  addClipShape,
  addTransformGroup,
  embedImages,
} from "../../utils/svg";

// TODO: add that, and through the webworker
//import { optimize } from "svgo/dist/svgo.browser";

interface Props extends ModalFuncProps {
  format: FormatType;
}

const ExportInfo: FC<{
  loading: boolean;
  result?: string;
  size: Size;
}> = ({ loading, result, size }) => {
  if (loading || !result) return null;
  return (
    <span key="preview-info" className="preview--info">
      {formatSize(size)}
    </span>
  );
};

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
        svg(ogma)
          .setOptions({
            texts: textsVisible,
          })
          .on("start", () => setProgress(0))
          .on("progress", (progress) => setProgress(progress))
          .run({
            fullSize: format.value === undefined,
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
    if (format.label === "SVG") {
      downloadBlob(
        image as string,
        `${visualisation.title}.svg`,
        "image/svg+xml"
      );
    } else {
      const data = await svgToPng(stringToSVGElement(image as string));
      downloadBlob(data, `${visualisation.title}.png`, "image/png");
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
