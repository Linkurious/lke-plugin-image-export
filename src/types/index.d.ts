declare module "jspdf" {
  interface jsPDF {
    getPageWidth: () => number;
    getPageHeight: () => number;
  }
}
