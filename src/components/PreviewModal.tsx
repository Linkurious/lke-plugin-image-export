import React, { FC, useEffect, useState } from "react";
import { Button, Menu, Modal, ModalFuncProps, Progress, Dropdown } from "antd";
import { FormatType } from "../types/formats";
import { useAppContext } from "../context";
import { svg } from "@linkurious/png-export-stitch";
import { Size } from "@linkurious/ogma";
import embedFonts from "@linkurious/svg-font-embedder";
import { ImageViewer } from "./ImageViewer";
import { DownloadOutlined, DownOutlined } from "@ant-design/icons";
import { formatSize } from "../utils";
import { optimize } from "svgo/dist/svgo.browser";

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
  const { ogma } = useAppContext();
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
          const optimzed = optimize(result, {}).data;
          console.timeEnd("optimize");
          setImage(optimzed);
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

  const onDownloadPressed = () => {
    const blob = new Blob([image as string], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph.svg";
    a.click();
    URL.revokeObjectURL(url);
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
          onClick={onDownloadPressed}
          disabled={loading}
          icon={<DownloadOutlined />}
        >
          Export
        </Button>,
        <Dropdown
          disabled={loading}
          key="type"
          overlay={menu}
          trigger={["click"]}
        >
          <Button disabled={loading}>
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
