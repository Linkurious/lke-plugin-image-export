import { Control } from "@linkurious/ogma-annotations";
import Ogma, { Size, Color, StyleRule } from "@linkurious/ogma";

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
  return doc.documentElement as unknown as SVGSVGElement;
};

export function scaleGraph(ogma: Ogma, scale: number, editor: Control) {
  const { x, y } = ogma.view.getCenter();
  const nodes = ogma.getNodes();
  const positions = nodes.getPosition();

  if (scale === 1) return Promise.resolve(nodes);

  editor.getAnnotations().features.forEach((feature) => {
    editor.setScale(feature.id, scale, x, y);
  });

  return nodes.setAttributes(
    positions.map((pos) => {
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
      const { x, y, radius } = attributes[i];
      let minTextX = x;
      let minTextY = y;
      let maxTextX = x;
      let maxTextY = y;
      const textBbox = texts ? ogma.view.getTextBoundingBox(node) : null;
      if (textBbox) {
        const { minX, minY, maxX, maxY } = textBbox;
        minTextX = minX;
        minTextY = minY;
        maxTextX = maxX;
        maxTextY = maxY;
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

/**
 * TODO: remove this, it's a hack. StyleRules should bail out if they are
 * already destroyed, or provide an simple way to check if they are destroyed.
 */
export async function destroyRule(rule: StyleRule, ogma: Ogma) {
  const rules = ogma.styles.getRuleList();
  const ruleId = rule.getId();
  for (const r of rules) if (r.getId() === ruleId) return await rule.destroy();
  return void 0;
}

export const meanValue = (values: number[]) =>
  values.reduce((acc, v) => acc + v, 0) / values.length;
