import React, { useState } from "react";
import {
  Modal,
  Button,
  Collapse,
  Typography,
  Divider,
  Form,
  Select,
  Switch,
} from "antd";
import { fontSizes, formats } from "../constants";
import { FormatType } from "../types/formats";
import { FormatInfo } from "./FormatInfo";
import { useAppContext } from "../context";

type SizeType = Parameters<typeof Form>[0]["size"];

export function Panel() {
  const { ogma } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [currentFormat, setCurrentFormat] = useState<FormatType>(formats[0]);
  const [textsVisible, setTextsVisible] = useState(true);
  const [overlapRemoval, setOverlapRemoval] = useState(true);
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
            <Form.Item label="Text wrapping" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
            <Form.Item label="Collision removal" valuePropName="checked">
              <Switch
                size="small"
                checked={overlapRemoval}
                onChange={() => {
                  ogma.setOptions({
                    texts: { preventOverlap: !overlapRemoval },
                  });
                  setOverlapRemoval(!overlapRemoval);
                }}
              />
            </Form.Item>
            <Form.Item label="Size" valuePropName="checked">
              <Select
                style={{ width: 130 }}
                defaultValue={1}
                onChange={(index) => console.log(fontSizes[index])}
              >
                {fontSizes.map((item, index) => (
                  <Select.Option key={index} value={index}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Divider />
            <Form.Item label="Snapping" valuePropName="checked">
              <Switch size="small" />
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
        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    </div>
  );
}
