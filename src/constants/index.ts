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
  "Letter paper": {
    label: "Letter paper",
    value: { width: 816, height: 1056 },
  },
  "Ledger paper": {
    label: "Ledger paper",
    value: { width: 1056, height: 1632 },
  },
  // values here are for 96dppi
  "A4 paper": { label: "A4 paper", value: { width: 794, height: 1123 } },
  "A3 paper": { label: "A3 paper", value: { width: 1123, height: 1587 } },
  "A4 paper (landscape)": {
    label: "A4 paper (landscape)",
    value: { width: 1123, height: 794 },
  },
  "A3 paper (landscape)": {
    label: "A3 paper (landscape)",
    value: { width: 1587, height: 1123 },
  },
  "B4 paper": { label: "B4 paper", value: { width: 945, height: 1334 } },
  "B5 paper": { label: "B5 paper", value: { width: 665, height: 945 } },
  Overhead: { label: "Overhead", value: { width: 960, height: 720 } },
  Banner: { label: "Banner", value: { width: 768, height: 96 } },
  "16:9": { label: "16:9", value: { width: 960, height: 540 } },
  "16:10": { label: "16:10", value: { width: 960, height: 600 } },
  Widescreen: { label: "Widescreen", value: { width: 1920, height: 1080 } },
};

export const formats: FormatType[] = Object.keys(formatLookup).map(
  (key: Format) => formatLookup[key]
);

/**
 * Minimum backdrop preview width
 */
export const backdropMargin = 50;
