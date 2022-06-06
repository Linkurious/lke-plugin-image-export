import { Format, FormatType } from "../types/formats";

export const fontSizes = [
  { label: "0.5x", value: "0.5" },
  { label: "1x", value: "1" },
  { label: "1.5x", value: "1.5" },
  { label: "2x", value: "2" },
];

export const formatLookup: Record<Format, FormatType> = {
  "Full size": { label: "Full size", value: undefined },
  Square: { label: "Square", value: { width: 960, height: 960 } },
  "4:3": { label: "4:3", value: { width: 960, height: 720 } },
  "Letter paper": { label: "Letter paper", value: { width: 960, height: 720 } },
  "Ledger paper": {
    label: "Ledger paper",
    value: { width: 1278.62, height: 959.04 },
  },
  "A4 paper": { label: "A4 paper", value: { width: 1039.97, height: 720 } },
  "A3 paper": { label: "A3 paper", value: { width: 1344.0, height: 1008.0 } },
  "B4 paper": { label: "B4 paper", value: { width: 1136.64, height: 852.48 } },
  "B5 paper": { label: "B5 paper", value: { width: 707.2, height: 1000 } },
  Overhead: { label: "Overhead", value: { width: 960, height: 720 } },
  Banner: { label: "Banner", value: { width: 768, height: 96 } },
  "16:9": { label: "16:9", value: { width: 960, height: 540 } },
  "16:10": { label: "16:10", value: { width: 960, height: 600 } },
  Widescreen: { label: "Widescreen", value: { width: 1279.97, height: 720 } },
};

export const formats: FormatType[] = Object.keys(formatLookup).map(
  (key: Format) => formatLookup[key]
);
