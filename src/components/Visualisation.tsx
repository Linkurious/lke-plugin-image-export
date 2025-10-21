import { useAppContext } from "../context";
import { Backdrop } from "./Backdrop";
import { Minimap } from "./Minimap";
import { Ogma } from "./Ogma";
import { ZoomControl } from "./ZoomControl";
import { VersionInfo } from "./VersionInfo";
import {NodeGroupingRule} from "@linkurious/rest-client";

export function Visualisation() {
  const { visualisation, setOgma, format, nodeGroupingRules } =
    useAppContext();
  const getAppliedNodeGroupingRule =  (nodeGroupingRules: NodeGroupingRule[], appliedRule: number[]) => {
    return nodeGroupingRules.filter((rule) => appliedRule.includes(rule.id));
  }
  return (
    <>
      <Ogma
        graph={visualisation}
        onReady={(ogma) => setOgma(ogma)}
        appliedNodeGroupingRules={getAppliedNodeGroupingRule(nodeGroupingRules, visualisation.nodeGroupingRuleIds || [])}
      >
        <ZoomControl />
        <Minimap />
        <VersionInfo />
      </Ogma>
      <Backdrop format={format} />
    </>
  );
}
