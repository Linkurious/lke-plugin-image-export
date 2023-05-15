import React, { FC, useState } from "react";

import Button from "antd/es/button/button";
import Switch from "antd/es/switch";
import Dropdown from "antd/es/dropdown";

import { DownOutlined } from "@ant-design/icons";
import { formatSize } from "../../utils";
import { Size } from "@linkurious/ogma";
import { ExportTypes } from "../../constants";
import { ExportType } from "../../types/formats";

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

interface FooterProps {
  background: boolean;
  setBackground: (background: boolean) => void;
  onDownload: (type: ExportType) => void;
  loading: boolean;
  image: string;
  size: Size;
}

export const Footer: FC<FooterProps> = ({
  background,
  setBackground,
  onDownload,
  loading,
  image,
  size,
}) => {
  const [currentFormat, setCurrentFormat] = useState<ExportType>({
    key: "1",
    label: "SVG",
  });
  return (
    <>
      <span className="preview-background-selector" key="background">
        <span className="preview-background-selector--label">background</span>
        <Switch
          size="small"
          className="snap-switch"
          checked={background}
          onChange={() => {
            setBackground(!background);
          }}
        />
      </span>
      <ExportInfo key="info" loading={loading} result={image} size={size} />
      <Button
        key="ok"
        type="primary"
        onClick={() => onDownload(currentFormat)}
        disabled={loading}
        className="download--button"
        //icon={<DownloadOutlined />}
      >
        Download
      </Button>
      <Dropdown
        disabled={loading}
        key="type"
        menu={{
          onClick: ({ key }) => {
            setCurrentFormat(ExportTypes.find(({ key: k }) => k === key)!);
          },
          items: ExportTypes.filter(
            ({ label }) => label !== currentFormat.label
          ),
        }}
        trigger={["click"]}
      >
        <Button
          type="primary"
          disabled={loading}
          className="download--dropdown-trigger"
        >
          {currentFormat.label} <DownOutlined />
        </Button>
      </Dropdown>
    </>
  );
};
