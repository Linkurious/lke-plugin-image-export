import { Size } from "@linkurious/ogma";

export type Format =
  | "Full size"
  | "Square"
  | "4:3"
  | "Letter paper"
  | "Ledger paper"
  | "A4 paper"
  | "A3 paper"
  | "B4 paper"
  | "B5 paper"
  | "Overhead"
  | "Banner"
  | "16:9"
  | "16:10"
  | "Widescreen";

export type FormatType = {
  label: Format;
  value: Size | undefined;
};
