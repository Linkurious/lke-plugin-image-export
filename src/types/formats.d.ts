import { Size } from "@linkurious/ogma";

export type Format =
  | "Full size"
  | "Square"
  | "4:3"
  | "Letter paper"
  | "Ledger paper"
  | "A4"
  | "A3"
  | "A4 (landscape)"
  | "A3 (landscape)"
  | "B4"
  | "B5"
  | "Overhead"
  | "Banner"
  | "16:9"
  | "16:10"
  | "Widescreen";

export type FormatType = {
  label: Format;
  value: Size | undefined;
};

export type FileFormats = "PNG" | "SVG" | "PDF";

export type ExportType = {
  key: string;
  label: FileFormats;
};
