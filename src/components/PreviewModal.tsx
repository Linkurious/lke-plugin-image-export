import React, { FC, useEffect, useState } from "react";
import { Button, Modal, ModalFuncProps, Progress } from "antd";
import { FormatType } from "../types/formats";
import { useAppContext } from "../context";
import { svg } from "@linkurious/png-export-stitch";
import { Size } from "@linkurious/ogma";
import { ImageViewer } from "./ImageViewer";

interface Props extends ModalFuncProps {
  format: FormatType;
}

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

  useEffect(() => {
    if (visible && !image && ogma) {
      setLoading(true);
      svg(ogma)
        .on("start", () => setProgress(0))
        .on("progress", (progress) => setProgress(progress))
        .on("done", () => setLoading(false))
        .run()
        .then((res) => {
          const width = parseFloat(res.getAttribute("width")!);
          const height = parseFloat(res.getAttribute("height")!);
          setSize({ width, height });
          setImage(new XMLSerializer().serializeToString(res));
        });
    }
    return () => {
      if (visible) setImage("");
    };
  }, [visible]);

  return (
    <Modal
      title="Preview"
      className="preview--modal"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={"80vw"}
      footer={[
        <span key="info">Info</span>,
        <Button key="ok" onClick={onOk}>
          Save
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
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
