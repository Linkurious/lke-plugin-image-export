import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Button,
  Collapse,
  Typography,
  Divider,
  Form,
  Select,
  Switch,
  Slider,
} from "antd";
import { formats } from "../constants";
import { FormatType } from "../types/formats";
import { FormatInfo } from "./FormatInfo";
import { useAppContext } from "../context";
import { PreviewModal } from "./PreviewModal";
import { StyleRule } from "@linkurious/ogma";

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
  const { ogma, textsVisible, setTextsVisible } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [currentFormat, setCurrentFormat] = useState<FormatType>(formats[0]);
  //const [textsVisible, setTextsVisible] = useState(true);
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
    if (ogma) {
      const rule = ogma.styles.addRule({
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
    };
  }, [ogma]);

  return (
    <div className="panel">
      <Collapse collapsible="header" defaultActiveKey={[1]} ghost>
        <Collapse.Panel
          collapsible="header"
          header="Options"
          key="1"
          className="panel--settings"
        >
          <Form
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            layout="horizontal"
            labelWrap={true}
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size="small"
          >
            <Typography.Title level={5}>Captions</Typography.Title>
            <Form.Item label="Visibility" valuePropName="checked">
              <Switch
                size="small"
                checked={textsVisible}
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
                tipFormatter={(value) => `${value}%`}
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
              <Select
                style={{ width: 130 }}
                defaultValue={0}
                onChange={(index) => setCurrentFormat(formats[index])}
              >
                {formats.map((item, index) => (
                  <Select.Option value={index} key={index}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <FormatInfo {...currentFormat} />
          </Form>
        </Collapse.Panel>
      </Collapse>
      <div className="panel--controls">
        <Button type="primary" onClick={showModal}>
          Preview
        </Button>
        <PreviewModal
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          format={currentFormat}
        />
      </div>
    </div>
  );
}
