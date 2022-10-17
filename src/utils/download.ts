import { svgElementToString, svgToPng } from "@linkurious/ogma-export-stitch";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import { ExportType } from "../types/formats";

export function downloadBlob(
  data: string | Uint8Array,
  fileName: string,
  mimeType: string
) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => window.URL.revokeObjectURL(url), 250);
}

function downloadURL(data: string, fileName: string) {
  const a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  a.remove();
}

export async function handleDownload(
  el: SVGSVGElement,
  format: ExportType,
  fileName: string
) {
  if (format.label === "PDF") {
    const svg = el.cloneNode(true) as SVGSVGElement;
    const svgWidth = parseInt(svg.getAttribute("width") as string);
    const svgHeight = parseInt(svg.getAttribute("height") as string);
    const pdf = new jsPDF({
      format: [svgWidth, svgHeight],
      // otherwise it swaps the dimensions automatically (lol)
      orientation: svgWidth > svgHeight ? "landscape" : "portrait",
      unit: "pt",
      compress: true,
    });
    const margin = 0;
    // TODO: migrate to more recent version of jsPDF, this one has bad types
    // @ts-ignore
    const pageWidth = pdf.getPageWidth() - margin * 2;
    // @ts-ignore
    const pageHeight = pdf.getPageHeight() - margin * 2;

    // vertical cursor
    let y = margin;
    // fitting ratio canvas to page
    let ratio = 1 / Math.max(svgWidth / pageWidth, svgHeight / pageHeight);
    // seems like big sizes breaks it
    const width = svgWidth * ratio;
    const height = svgHeight * ratio;
    // resize SVG
    el.setAttribute("width", width.toString());
    el.setAttribute("height", height.toString());
    // fit the contents of SVG
    svg.setAttribute("viewBox", `0 0 ${width / ratio} ${height / ratio}`);

    await pdf.svg(svg, { x: margin, y, width, height });
    await pdf.save(`${fileName}.pdf`);
  } else {
    const imgDownload = svgElementToString(el);

    if (format.label === "SVG") {
      downloadBlob(imgDownload, `${fileName}.svg`, "image/svg+xml");
    } else if (format.label === "PNG") {
      const data = await svgToPng(el);
      downloadBlob(data, `${fileName}.png`, "image/png");
    }
  }
}
