import React, { FC } from "react";
import { Layout, Result } from "antd";

interface ConfigurationErrorProps {
  error: Error;
}

export const ConfigurationError: FC<ConfigurationErrorProps> = () => (
  <Layout>
    <Layout.Content>
      <Result
        status="error"
        title="Configuration error"
        subTitle="We are working on it"
      />
    </Layout.Content>
  </Layout>
);
