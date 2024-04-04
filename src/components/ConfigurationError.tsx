import React, { FC } from "react";
import Layout from "antd/lib/layout";
import Result from "antd/lib/result";

interface ConfigurationErrorProps {
  error: Error;
}

export const ConfigurationError: FC<ConfigurationErrorProps> = ({error}) => (
  <Layout>
    <Layout.Content>
      <Result
        status="error"
        title="Configuration error"
        subTitle={error.message}
      />
    </Layout.Content>
  </Layout>
);
