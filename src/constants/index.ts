import { Size } from "@linkurious/ogma";
import { ExportType, Format, FormatType } from "../types/formats";

export const fontSizes = [
  { label: "0.5x", value: "0.5" },
  { label: "1x", value: "1" },
  { label: "1.5x", value: "1.5" },
  { label: "2x", value: "2" },
];

const paperFormatsInches: Record<Format, Size | undefined> = {
  "Letter paper": { width: 8.5, height: 11 },
  "Ledger paper": { width: 11, height: 17 },
  "A4 paper": { width: 8.3, height: 11.7 },
  "A4 paper (landscape)": { width: 11.7, height: 8.3 },
  "A3 paper": { width: 11.7, height: 16.5 },
  "A3 paper (landscape)": { width: 16.5, height: 11.7 },
  "B4 paper": { width: 25, height: 35.3 },
  "B5 paper": { width: 19.05, height: 25 },

  Overhead: { width: 11.5, height: 8.5 },
  "Full size": undefined,
  Square: undefined,
  "4:3": undefined,
  Banner: undefined,
  "16:9": undefined,
  "16:10": undefined,
  Widescreen: undefined,
};

type ScreenSizes = Extract<
  Format,
  "Full size" | "Square" | "Banner" | "16:9" | "16:10" | "4:3" | "Widescreen"
>;

const dppi = 96;
// calculate the size of the paper in pixels
const paperSizes: Record<
  Exclude<Format, ScreenSizes>,
  FormatType
> = Object.keys(paperFormatsInches).reduce((acc, key: Format) => {
  const size = paperFormatsInches[key];
  if (size)
    acc[key] = {
      label: key,
      value: {
        width: Math.floor(size.width * dppi),
        height: Math.floor(size.height * dppi),
      },
    };
  return acc;
}, {} as Record<Format, FormatType>);

// source of truth for the export types
export const formatLookup: Record<Format, FormatType> = {
  "Full size": { label: "Full size", value: undefined },
  Square: { label: "Square", value: { width: 960, height: 960 } },
  "4:3": { label: "4:3", value: { width: 960, height: 720 } },
  Banner: { label: "Banner", value: { width: 768, height: 96 } },
  "16:9": { label: "16:9", value: { width: 960, height: 540 } },
  "16:10": { label: "16:10", value: { width: 960, height: 600 } },
  Widescreen: { label: "Widescreen", value: { width: 1920, height: 1080 } },
  ...paperSizes,
};

export const formats: FormatType[] = Object.keys(formatLookup).map(
  (key: Format) => formatLookup[key]
);

/**
 * Minimum backdrop preview width
 */
export const backdropMargin = 50;

export const ExportTypes: ExportType[] = [
  {
    key: "1",
    label: "SVG",
  },
  {
    key: "2",
    label: "PNG",
  },
];

export const fullSizeMargin = 0.075;
