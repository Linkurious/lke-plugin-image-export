import React from "react";
import { Layout, Button } from "antd";
import "antd/dist/antd.css";
import { useAppContext } from "../context";
import { Visualisation, Panel, Spinner, Minimap } from "../components";

export function Dashboard() {
  const { loading } = useAppContext();
  return (
    <Layout>
      <Layout.Content>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Visualisation />
            <Minimap />
            <Panel />
          </>
        )}
      </Layout.Content>
    </Layout>
  );
}
