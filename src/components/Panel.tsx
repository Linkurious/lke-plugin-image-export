import React, { useCallback, useEffect, useState } from "react";

import Button from "antd/es/button/button";
import Divider from "antd/es/divider";
import Collapse from "antd/es/collapse";
import Form from "antd/es/form";
import Slider from "antd/es/slider";
import Switch from "antd/es/switch";
import Dropdown from "antd/es/dropdown";
import Typography from "antd/es/typography";

import { DownOutlined } from "@ant-design/icons";
import { formats } from "../constants";
import { FormatInfo } from "./FormatInfo";
import { useAppContext } from "../context";
import { Modal } from "./Preview";
import { StyleRule } from "@linkurious/ogma";
import { LkEdgeData, LkNodeData } from "@linkurious/rest-client";
import { destroyRule } from "../utils";

type SizeType = Parameters<typeof Form>[0]["size"];

const marks: Record<number, string> = {
  10: "10%",
  50: "50%",
  100: "100%",
  200: "200%",
  300: "300%",
};

const fontSize = { ratio: 1 };

export function Panel() {
  const { ogma, format, setFormat, textsVisible, setTextsVisible } =
    useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [overlapRemoval, setOverlapRemoval] = useState(true);
  const [snapping, setSnapping] = useState(false);

  const [fontSizeRule, setFontSizeRule] = useState<StyleRule>();
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fontSize.ratio = 1;
    let rule: StyleRule<LkNodeData, LkEdgeData>;
    if (ogma) {
      rule = ogma.styles.addRule({
        nodeAttributes: {
          text: {
            size: (node) => {
              if (node) return +node.getAttribute("text.size") * fontSize.ratio;
            },
          },
        },
        edgeAttributes: {
          text: {
            size: (edge) => {
              if (edge) return +edge.getAttribute("text.size") * fontSize.ratio;
            },
          },
        },
      });
      setFontSizeRule(rule);
    }
    return () => {
      fontSize.ratio = 1;
      if (ogma && rule) destroyRule(rule, ogma);
    };
  }, [ogma]);

  return (
    <div className="panel">
          <Form
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            layout="horizontal"
            labelWrap={true}
            labelAlign="left"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size="small"
          >
            <Typography.Title level={5}>Captions</Typography.Title>
            <Form.Item label="Visibility" valuePropName="checked">
              <Switch
                size="small"
                checked={textsVisible}
                className="caption-switch"
                onChange={() => {
                  ogma.styles.setEdgeTextsVisibility(!textsVisible);
                  ogma.styles.setNodeTextsVisibility(!textsVisible);
                  setTextsVisible(!textsVisible);
                }}
              />
            </Form.Item>
            <Form.Item label="Collision removal" valuePropName="checked">
              <Switch
                size="small"
                checked={overlapRemoval}
                className="collision-switch"
                disabled={!textsVisible}
                onChange={() => {
                  ogma.setOptions({
                    texts: { preventOverlap: !overlapRemoval },
                  });
                  setOverlapRemoval(!overlapRemoval);
                }}
              />
            </Form.Item>
            <div>
              <span>Text size</span>
              <Slider
                tooltip={{ formatter: (value) => `${value}%` }}
                marks={marks}
                included={false}
                min={1}
                max={300}
                defaultValue={100}
                disabled={!textsVisible}
                onChange={(value) => {
                  fontSize.ratio = value / 100;
                  if (fontSizeRule) fontSizeRule.refresh();
                }}
              />
            </div>
            <Divider />
            <Form.Item label="Snapping" valuePropName="checked">
              <Switch
                size="small"
                className="snap-switch"
                onChange={() => {
                  if (!snapping)
                    ogma.tools.snapping.enable({
                      neighbours: {},
                    });
                  else ogma.tools.snapping.disable();
                  setSnapping(!snapping);
                }}
              />
            </Form.Item>
            <Divider />
            <Typography.Title level={5}>Format</Typography.Title>
            <Form.Item label="Size">
              <Dropdown
                trigger={["click"]}
                menu={{
                  selectable: true,
                  defaultSelectedKeys: ["0"],
                  onSelect: ({ key }) => setFormat(formats[Number(key)]),
                  items: formats.map((item, index) => ({
                    key: index,
                    label: item.label,
                  })),
                }}
                placement="bottom"
                className="format-select"
              >
                <Button icon={<DownOutlined />}>{format.label}</Button>
              </Dropdown>
            </Form.Item>
            <FormatInfo {...format} />
          </Form>
      <div className="panel--controls">
        <Button type="primary" onClick={showModal} className="preview--button">
          Preview
        </Button>
        <Modal
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          format={format}
        />
      </div>
    </div>
  );
}
