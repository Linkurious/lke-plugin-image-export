export const createSVGElement = <T extends SVGElement>(tagName: string): T => {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName) as T;
};

const GREY = "#e0e0e0";

export function addCheckerboard(svg: SVGSVGElement) {
  const pattern = createSVGElement<SVGPatternElement>("pattern");
  pattern.setAttribute("id", "pattern-checkers");
  pattern.setAttribute("x", "0");
  pattern.setAttribute("y", "0");
  pattern.setAttribute("width", "10");
  pattern.setAttribute("height", "10");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");

  svg.insertBefore(pattern, svg.firstChild);

  const rect1 = createSVGElement<SVGRectElement>("rect");
  rect1.setAttribute("x", "0");
  rect1.setAttribute("y", "0");
  rect1.setAttribute("width", "5");
  rect1.setAttribute("height", "5");
  rect1.setAttribute("fill", GREY);
  rect1.classList.add("checker");

  const rect2 = createSVGElement<SVGRectElement>("rect");
  rect2.setAttribute("x", "5");
  rect2.setAttribute("y", "5");
  rect2.setAttribute("width", "5");
  rect2.setAttribute("height", "5");
  rect2.setAttribute("fill", GREY);

  rect2.classList.add("checker");

  pattern.appendChild(rect1);
  pattern.appendChild(rect2);
}

export function addClipShape(svg: SVGSVGElement) {
  const clipPath = createSVGElement<SVGClipPathElement>("clipPath");
  clipPath.setAttribute("id", "ogma-canvas-clip");
  const clipShape = createSVGElement<SVGRectElement>("rect");
  clipShape.setAttribute("width", svg.getAttribute("width")!);
  clipShape.setAttribute("height", svg.getAttribute("height")!);
  clipPath.appendChild(clipShape);
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
