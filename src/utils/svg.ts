export const createSVGElement = <T extends SVGElement>(tagName: string): T => {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName) as T;
};

const GREY = "#e0e0e0";
const WHITE = "#ffffff";

export function addCheckerboard(svg: SVGSVGElement) {
  const pattern = createSVGElement<SVGPatternElement>("pattern");
  pattern.setAttribute("id", "pattern-checkers");
  pattern.setAttribute("x", "0");
  pattern.setAttribute("y", "0");
  pattern.setAttribute("width", "10");
  pattern.setAttribute("height", "10");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");

  svg.insertBefore(pattern, svg.firstChild);

  const side = 5;
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      const rect = createSVGElement<SVGRectElement>("rect");
      rect.setAttribute("x", `${x * side}`);
      rect.setAttribute("y", `${y * side}`);
      rect.setAttribute("width", `${side}`);
      rect.setAttribute("height", `${side}`);
      rect.setAttribute("fill", x === y ? GREY : WHITE);
      pattern.appendChild(rect);
    }
  }
}

export function addClipShape(
  svg: SVGSVGElement,
  width: number,
  height: number
) {
  const clipPath = createSVGElement<SVGClipPathElement>("clipPath");
  clipPath.setAttribute("id", "ogma-canvas-clip");
  const clipShape = createSVGElement<SVGRectElement>("rect");
  clipShape.setAttribute("width", width.toString());
  clipShape.setAttribute("height", height.toString());
  clipPath.appendChild(clipShape);
  const bgNode = svg.querySelector(".ogma-svg-background") as SVGRectElement;
  bgNode.setAttribute("width", width.toString());
  bgNode.setAttribute("height", height.toString());
  svg.insertBefore(clipPath, svg.firstChild);
}

export function addTransformGroup(svg: SVGSVGElement) {
  const transformGroup = createSVGElement<SVGGElement>("g");
  transformGroup.setAttribute("clip-path", "url(#ogma-canvas-clip)");
  transformGroup.classList.add("tranform-group");
  Array.prototype.filter
    .call(
      svg.children,
      (d: SVGElement) => d.tagName !== "pattern" && d.tagName !== "clipPath"
    )
    .forEach((child: SVGElement) => transformGroup.appendChild(child));
  svg.appendChild(transformGroup);
}
