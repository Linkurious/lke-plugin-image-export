import React from "react";
import Layout from "antd/es/layout";
import "antd/dist/reset.css";
import { useAppContext } from "../context";
import { Visualisation, Panel, Spinner } from "../components";
import { ConfigurationError } from "../components/ConfigurationError";
import { AnnotationsControl } from "../components/Annotations";

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
            <AnnotationsControl />
          </>
        )}
      </Layout.Content>
    </Layout>
  );
}
