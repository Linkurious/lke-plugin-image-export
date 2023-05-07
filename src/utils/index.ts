import Ogma, { Size, Color } from "@linkurious/ogma";

export const formatSize = ({ width, height }: Size, suffix = "px") => {
  return `${Math.round(width)} × ${Math.round(height)} ${suffix}`;
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

export const stopPropagation = (e: Event) => e.stopPropagation();

export type Bounds = [number, number, number, number];

export function mergeBounds(b0: Bounds, b1?: Bounds): Bounds {
  if (!b1) return b0;
  return [
    Math.min(b0[0], b1[0]),
    Math.min(b0[1], b1[1]),
    Math.max(b0[2], b1[2]),
    Math.max(b0[3], b1[3]),
  ];
}

export function getBoundingBox(ogma: Ogma, texts: boolean): Bounds {
  const attributes = ogma.getNodes().getAttributes(["x", "y", "radius"]);
  return ogma.getNodes().reduce(
    (acc, node, i) => {
      let { x, y, radius } = attributes[i];
      const textBbox = texts ? ogma.view.getTextBoundingBox(node) : null;
      let minTextX = x;
      let minTextY = y;
      let maxTextX = x;
      let maxTextY = y;
      if (textBbox) {
        const tl = ogma.view.screenToGraphCoordinates({
          x: textBbox.minX,
          y: textBbox.minY,
        });
        const br = ogma.view.screenToGraphCoordinates({
          x: textBbox.maxX,
          y: textBbox.maxY,
        });
        minTextX = tl.x;
        minTextY = tl.y;
        maxTextX = br.x;
        maxTextY = br.y;
      }
      acc[0] = Math.min(acc[0], x - +radius, minTextX);
      acc[1] = Math.min(acc[1], y - +radius, minTextY);
      acc[2] = Math.max(acc[2], x + +radius, maxTextX);
      acc[3] = Math.max(acc[3], y + +radius, maxTextY);
      return acc;
    },
    [Infinity, Infinity, -Infinity, -Infinity]
  );
}
