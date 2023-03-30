import { MenuProps } from "antd";
import { RgbaColor, hexToRgba } from "@uiw/color-convert";

export const iconSize = 16;
export const arrowIconSize = 12;

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

export const lineWidthItems = [
  { value: 1, title: "thin" },
  { value: 5, title: "medium" },
  { value: 10, title: "thick" },
  { value: 20, title: "xl" },
];

export const colors = [
  "#FFFFFF",
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
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

export const backgroundColors = [
  { r: 0, g: 0, b: 0, a: 0 },
  ...colors.slice(1).map(hexToRgba),
].map(rgbaToString);

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
