import {
  AnnotationCollection,
  getAnnotationsBounds,
} from "@linkurious/ogma-annotations";
import Ogma, { SVGExportOptions } from "@linkurious/ogma";
import { getBoundingBox, mergeBounds } from ".";

const SVG_NS = "http://www.w3.org/2000/svg";

export const createSVGElement = <T extends SVGElement>(tagName: string): T => {
  return document.createElementNS(SVG_NS, tagName) as T;
};

const GREY = "#e0e0e0";
const WHITE = "#ffffff";

export function addCheckerboard(svg: SVGSVGElement) {
  const w = 5;
  const pattern = createSVGElement<SVGPatternElement>("pattern");
  pattern.setAttribute("id", "pattern-checkers");
  pattern.setAttribute("x", "0");
  pattern.setAttribute("y", "0");
  pattern.setAttribute("width", (2 * w).toString());
  pattern.setAttribute("height", (2 * w).toString());
  pattern.setAttribute("patternUnits", "userSpaceOnUse");

  svg.insertBefore(pattern, svg.firstChild);

  const side = w;
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
  transformGroup.classList.add("transform-group");
  Array.prototype.filter
    .call(
      svg.children,
      (d: SVGElement) => d.tagName !== "pattern" && d.tagName !== "clipPath"
    )
    .forEach((child: SVGElement) => transformGroup.appendChild(child));
  svg.appendChild(transformGroup);
}

const toDataURL = (url: string): Promise<string> =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

export function embedImages(svg: SVGSVGElement) {
  const images = svg.querySelectorAll("image");
  const promises: Promise<string>[] = [];
  const replacements: SVGImageElement[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i] as SVGImageElement;
    const url = image.getAttribute("href");
    if (url) {
      replacements.push(images[i]);
      promises.push(toDataURL(url));
    }
  }

  return Promise.all(promises)
    .then((dataURLs: string[]) => {
      for (let i = 0; i < replacements.length; i++) {
        const image = replacements[i];
        // important to replace the href attribute
        image.removeAttribute("href");
        image.setAttribute("xlink:href", dataURLs[i]);
      }
    })
    .then(() => svg);
}

export const defaultOptions: SVGExportOptions = {
  groupSemantically: true,
  embedFonts: true,
  download: false,
  texts: true,
  margin: 0,
};

export async function exportClipped(
  ogma: Ogma,
  width: number,
  height: number,
  exportOptions: SVGExportOptions = {}
) {
  const options: SVGExportOptions = {
    ...defaultOptions,
    ...exportOptions,
  };

  // not much special, just ensure the default settings are correct
  return await ogma.export.svg({
    ...options,
    clip: true,
    width,
    height,
  });
}

export function getExportSize(
  ogma: Ogma,
  annotations: AnnotationCollection,
  options: SVGExportOptions = {}
) {
  // include annotations in the bounds
  const annotationBounds = getAnnotationsBounds(annotations);
  const graphBounds = getBoundingBox(ogma, !!options.texts);
  const [minX, minY, maxX, maxY] = mergeBounds(graphBounds, annotationBounds);

  const tl = ogma.view.graphToScreenCoordinates({ x: minX, y: minY });
  const br = ogma.view.graphToScreenCoordinates({ x: maxX, y: maxY });

  const width = br.x - tl.x + 2 * options.margin!;
  const height = br.y - tl.y + 2 * options.margin!;
  return { width, height, minX, minY, maxX, maxY };
}
export async function exportOrginalSize(
  ogma: Ogma,
  annotations: AnnotationCollection,
  exportOptions: SVGExportOptions = {}
) {
  const options: SVGExportOptions = {
    ...defaultOptions,
    ...exportOptions,
  };
  const view = ogma.view.get();
  const { width, height, minX, minY, maxX, maxY } = getExportSize(
    ogma,
    annotations,
    options
  );

  // resize canvas
  await ogma.view.setSize({ width, height });
  // center view
  await ogma.view.setCenter({ x: (minX + maxX) / 2, y: (minY + maxY) / 2 });
  await ogma.view.afterNextFrame();

  const svg = await ogma.export.svg({ clip: true, ...options });
  // reset canvas size
  await ogma.view.setSize({ width: view.width, height: view.height });
  return svg;
}

export function bringTextsToTop(svg: SVGSVGElement) {
  const container = svg.querySelector(".transform-group") as SVGGElement;
  // bubble up the texts
  const textComponents = Array.prototype.filter.call(
    container.querySelectorAll("[data-text-component]"),
    (el: SVGElement) => !el.classList.contains("badge-text")
  );
  // group them
  const captions = document.createElementNS(SVG_NS, "g");
  captions.classList.add("ogma-captions");
  Array.prototype.forEach.call(textComponents, (el: SVGElement) =>
    captions.appendChild(el)
  );
  const entitiesContainer = container.querySelector(".ogma-nodes")
    ?.parentNode as SVGGElement;
  entitiesContainer.appendChild(captions);
}
