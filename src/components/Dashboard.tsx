import React from "react";
import { Layout, Button } from "antd";
import "antd/dist/antd.css";
import { useAppContext } from "../context";
import { Visualisation } from "./Visualisation";
import { Panel } from "./Panel";

export function Dashboard() {
  const { loading } = useAppContext();
  if (loading) return <div>Loading...</div>;
  return (
    <Layout>
      <Layout.Content>
        <Visualisation />
      </Layout.Content>
      <Panel />
    </Layout>
  );
}
