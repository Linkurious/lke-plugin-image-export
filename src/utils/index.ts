import Ogma, { Size } from "@linkurious/ogma";

export const formatSize = ({ width, height }: Size, suffix = "px") => {
  return `${width} × ${height} px`;
};

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

export const stringToSVGElement = (svg: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  return doc.documentElement as any as SVGSVGElement;
};

export function scaleGraph(ogma: Ogma, scale: number) {
  const { x, y } = ogma.view.getCenter();
  const positions = ogma.getNodes().getPosition();
  return ogma.getNodes().setAttributes(
    positions.map((pos, i) => {
      const dx = pos.x - x;
      const dy = pos.y - y;

      return {
        x: x + dx * scale,
        y: y + dy * scale,
      };
    })
  );
}
