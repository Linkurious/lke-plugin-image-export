import React, { FC, useEffect, useState } from "react";
import { Button, Menu, Modal, ModalFuncProps, Progress, Dropdown } from "antd";
import { FormatType } from "../types/formats";
import { useAppContext } from "../context";
import { svg, svgToPng } from "@linkurious/ogma-export-stitch";
import { Size } from "@linkurious/ogma";
import embedFonts from "@linkurious/svg-font-embedder";
import { ImageViewer } from "./ImageViewer";
import { DownOutlined } from "@ant-design/icons";
import { formatSize, downloadBlob } from "../utils";

// TODO: add that, and through the webworker
//import { optimize } from "svgo/dist/svgo.browser";

interface Props extends ModalFuncProps {
  format: FormatType;
}

type ExportType = {
  key: string;
  label: "PNG" | "SVG";
};

const ExportTypes: ExportType[] = [
  {
    key: "1",
    label: "SVG",
  },
  {
    key: "2",
    label: "PNG",
  },
];

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

export const PreviewModal: FC<Props> = ({
  visible,
  onCancel,
  onOk,
  format,
}) => {
  const { ogma, textsVisible } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [currentFormat, setCurrentFormat] = useState<ExportType>({
    key: "1",
    label: "SVG",
  });

  useEffect(() => {
    if (visible && !image && ogma) {
      setLoading(true);
      ogma.getSelectedEdges().setSelected(false);
      ogma.getSelectedNodes().setSelected(false);
      svg(ogma)
        .setOptions({
          texts: textsVisible,
        })
        .on("start", () => setProgress(0))
        .on("progress", (progress) => setProgress(progress))
        .on("done", () => setLoading(false))
        .run()
        .then((res) => {
          const width = parseFloat(res.getAttribute("width")!);
          const height = parseFloat(res.getAttribute("height")!);
          setSize({ width, height });

          const svgString = new XMLSerializer().serializeToString(res);
          // TODO: add progress bar
          console.time("embed fonts");
          const result = embedFonts(svgString);
          console.timeEnd("embed fonts");
          console.time("optimize");
          //const optimzed = optimize(result, {}).data;
          console.timeEnd("optimize");
          setImage(result);
        });
    }
    return () => {
      if (visible) setImage("");
    };
  }, [visible]);

  const menu = (
    <Menu
      onClick={({ key }) => {
        setCurrentFormat(ExportTypes.find(({ key: k }) => k === key)!);
      }}
      items={ExportTypes.filter(({ label }) => label !== currentFormat.label)}
    />
  );

  const onDownloadPressed = async () => {
    if (currentFormat.label === "SVG") {
      downloadBlob(image as string, "image.svg", "image/svg+xml");
    } else {
      const data = await svgToPng(
        new DOMParser().parseFromString(image as string, "image/svg+xml")
          .documentElement as unknown as SVGSVGElement
      );
      downloadBlob(data, "image.png", "image/png");
    }
    if (onOk) onOk();
  };

  return (
    <Modal
      title="Preview"
      className="preview--modal"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={"80vw"}
      footer={[
        <ExportInfo key="info" loading={loading} result={image} size={size} />,
        <Button
          key="ok"
          type="primary"
          onClick={onDownloadPressed}
          disabled={loading}
          className="download--button"
          //icon={<DownloadOutlined />}
        >
          Download
        </Button>,
        <Dropdown
          disabled={loading}
          key="type"
          overlay={menu}
          trigger={["click"]}
        >
          <Button
            type="primary"
            disabled={loading}
            className="download--dropdown-trigger"
          >
            {currentFormat.label} <DownOutlined />
          </Button>
        </Dropdown>,
      ]}
    >
      <div className="preview--container">
        {loading && (
          <Progress
            className="preview--progressbar"
            percent={Math.round(progress)}
            size="small"
          />
        )}
        {image && <ImageViewer svg={image} size={size} />}
      </div>
    </Modal>
  );
};