import React from "react";
import { Layout } from "antd";
//import "antd/dist/antd.css";
import { useAppContext } from "../context";
import { Visualisation, Panel, Spinner } from "../components";
import { ConfigurationError } from "../components/ConfigurationError";

export function Dashboard() {
  const { loading, error } = useAppContext();
  if (error) return <ConfigurationError error={error} />;
  return (
    <Layout>
      <Layout.Content>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Visualisation />
            <Panel />
          </>
        )}
      </Layout.Content>
    </Layout>
  );
}
