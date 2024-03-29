import React, { FC } from "react";
import Spin from "antd/es/spin";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 24, flex: 1, justifySelf: "center" }}
    spin
  />
);

export const Spinner: FC = () => (
  <Spin
    indicator={antIcon}
    size="large"
    style={{ position: "absolute", top: "50%", left: "50%" }}
  />
);
