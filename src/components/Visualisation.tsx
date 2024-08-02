import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Minimap } from "./Minimap";
import { Ogma } from "./Ogma";
import { ZoomControl } from "./ZoomControl";
import { VersionInfo } from "./VersionInfo";
import {NodeGroupingRule} from "@linkurious/rest-client";

export function Visualisation() {
  const { visualisation, configuration, graphSchema, setOgma, format, nodeGroupingRules } =
    useAppContext();
  const getAppliedNodeGroupingRule =  (nodeGroupingRules: NodeGroupingRule[], appliedRule: number[]) => {
    return nodeGroupingRules.filter((rule) => appliedRule.includes(rule.id));
  }
  return (
    <>
      <Ogma
        graph={visualisation}
        options={configuration.ogmaConfig}
        schema={graphSchema}
        onReady={(ogma) => setOgma(ogma)}
        baseUrl={configuration.baseUrl}
        appliedNodeGroupingRules={getAppliedNodeGroupingRule(nodeGroupingRules, visualisation.nodeGroupingRuleIds)}
      >
        <ZoomControl />
        <Minimap />
        <VersionInfo />
      </Ogma>
      <Backdrop format={format} />
    </>
  );
}
