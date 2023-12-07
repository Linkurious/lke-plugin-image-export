declare module "jspdf" {
  interface jsPDF {
    getPageWidth: () => number;
    getPageHeight: () => number;
  }
}

declare module "@mapbox/mapbox-gl-rtl-text" {
  export const processBidirectionalText: (
    str: string,
    arr: number[]
  ) => string[];
  export const applyArabicShaping: (str: string) => string;
}
