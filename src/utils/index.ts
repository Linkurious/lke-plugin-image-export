import Ogma, { Size, Color } from "@linkurious/ogma";

export const formatSize = ({ width, height }: Size, suffix = "px") => {
  return `${width} × ${height} px`;
};

export const getOgmaBackgroundColor = (ogma: Ogma): NonNullable<Color> => {
  let color = ogma.getOptions().backgroundColor;
  // TODO: temportary and terrible hack for LKE, remove ASAP
  if (color) {
    const match = color.match(
      /rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d+(?:\.\d+)?)\)/
    );
    if (match && parseFloat(match[4]) === 0) {
      color = `rgba(${match.slice(1, 4).join(",")},1)`;
    }
  }
  return color || "";
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

export const stringtoBase64 = (str: string) =>
  btoa(unescape(encodeURIComponent(str)));
