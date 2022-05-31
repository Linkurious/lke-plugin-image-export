import { FormatType } from "../types/formats";

export const fontSizes = [
  { label: "0.5x", value: "0.5" },
  { label: "1x", value: "1" },
  { label: "1.5x", value: "1.5" },
  { label: "2x", value: "2" },
];

export const formats: FormatType[] = [
  { label: "Full size", value: undefined },
  { label: "Square", value: { width: 960, height: 960 } },
  { label: "4:3", value: { width: 960, height: 720 } },
  { label: "Letter paper", value: { width: 960, height: 720 } },
  { label: "Ledger paper", value: { width: 1278.62, height: 959.04 } },
  { label: "A4 paper", value: { width: 1039.97, height: 720 } },
  { label: "A3 paper", value: { width: 1344.0, height: 1008.0 } },
  { label: "B4 paper", value: { width: 1136.64, height: 852.48 } },
  { label: "B5 paper", value: { width: 707.2, height: 1000 } },
  { label: "Overhead", value: { width: 960, height: 720 } },
  { label: "Banner", value: { width: 768, height: 96 } },
  { label: "16:9", value: { width: 960, height: 540 } },
  { label: "16:10", value: { width: 960, height: 600 } },
  { label: "Widescreen", value: { width: 1279.97, height: 720 } },
];
