import { MenuProps } from "antd";
import { RgbaColor } from "@uiw/color-convert";

export const iconSize = 16;

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
  { key: "1", title: "thin" },
  { key: "2", title: "medium" },
  { key: "10", title: "thick" },
  { key: "20", title: "xl" },
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

export const rgbaToString = ({ r, g, b, a }: RgbaColor) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

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

export enum ArrowDirection {
  BOTH = "both",
  NONE = "none",
  HEAD = "head",
}
