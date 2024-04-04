import React, { FC } from "react";
import Layout from "antd/lib/layout";
import Result from "antd/lib/result";

interface ConfigurationErrorProps {
  error: Error;
}

export const ConfigurationError: FC<ConfigurationErrorProps> = () => (
  <Layout>
    <Layout.Content>
      <Result
        status="error"
        title="Configuration error"
        subTitle="Error while trying to read the configuration, please reload the page"
      />
    </Layout.Content>
  </Layout>
);
