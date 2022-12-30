import { MenuProps } from "antd";

export const iconSize = 22;

export type fontFamilyTypes =
  | 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif'
  | "Georgia, serif"
  | 'Menlo, Monaco, Consolas, "Courier New", monospace';

export type fontNameAliases = "Serif" | "Sans-serif" | "Serif" | "Monospace";

export const fontFamilies: Record<fontNameAliases, fontFamilyTypes> = {
  "Sans-serif": 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  Serif: "Georgia, serif",
  Monospace: 'Menlo, Monaco, Consolas, "Courier New", monospace',
};

export const fontItems: MenuProps["items"] = [
  { key: "Sans-serif", label: "Normal" },
  { key: "Serif", label: "Serif" },
  { key: "Monospace", label: "Monospace" },
];

export const fontSizeItems: MenuProps["items"] = [
  { key: "8", label: "8" },
  { key: "10", label: "10" },
  { key: "12", label: "12" },
  { key: "14", label: "14" },
  { key: "16", label: "16" },
];

export const lineWidthItems: MenuProps["items"] = [
  { key: "1", label: "<div>1</div>" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
];

export const colors = [
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
  "#DBDF00",
  "#A4DD00",
  "#68CCCA",
  "#73D8FF",
  "#AEA1FF",
  "#1E88E5",
  "#333333",
  "#808080",
  "#cccccc",
];

// darkened colors
export const colorsDark = [
  "#C42E1F",
  "#D47300",
  "#C8B700",
  "#B0B800",
  "#68BC00",
  "#16A5A5",
  "#009CE0",
  "#7B64C8",
  "#B779D7",
  "#000000",
  "#666666",
  "#999999",
  "#cccccc",
];
