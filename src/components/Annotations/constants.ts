import { MenuProps } from "antd";
import { RgbaColor } from "@uiw/color-convert";

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

export const fontItems: NonNullable<MenuProps["items"]> = [
  { key: "Sans-serif", label: "Normal" },
  { key: "Serif", label: "Serif" },
  { key: "Monospace", label: "Monospace" },
];

export const fontSizes = [8, 10, 12, 14, 16, 24, 32, 48, 64, 72];

export const fontSizeItems: MenuProps["items"] = fontSizes.map((fs) => ({
  key: fs.toString(),
  label: fs.toString(),
}));

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

export const TRANSPARENT = "none";
export const BLACK = "#333333";

export const rgbaToString = ({ r, g, b, a }: RgbaColor) =>
  `rgba(${r},${g},${b},${a})`;

export const backgroundColors = [TRANSPARENT, ...colors];

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
