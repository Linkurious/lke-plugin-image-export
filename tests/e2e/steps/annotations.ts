import { assert } from "chai";
import Ogma from "@linkurious/ogma";
import {
  colors,
  lineWidthItems,
  fontItems,
  fontFamilies,
  fontSizeItems,
} from "../../../src/components/Annotations/constants";
import { BrowserContext, Page } from "playwright";
import * as path from "path";
import * as fs from "fs/promises";
import { DOMParser } from "xmldom-qsa";

const { I } = inject();
const ogma = {} as Ogma;

const rootFolder = path.resolve(__dirname, "../../../reports/html/e2e/");
const screenshotFolder = path.join(rootFolder, "screenshot/");

const readSvg = async (fileName: string) => {
  const filePath = path.join(screenshotFolder, fileName);
  const svg = await fs.readFile(filePath, "utf-8");
  const doc = new DOMParser().parseFromString(svg);
  return { doc, svg };
};

When(/^I select annotation (\w+)$/, async (type: string) => {
  I.waitForElement(
    `.annotations-${type}--dropdown .ant-btn-compact-first-item`
  );
  I.click(`.annotations-${type}--dropdown .ant-btn-compact-first-item`);
});

When(/^I select annotation text$/, async () => {
  I.waitForElement(".annotations-text--dropdown .ant-btn-compact-first-item");
  I.click(".annotations-text--dropdown .ant-btn-compact-first-item");
});

When(
  /^I draw an arrow from (\d*),(\d+) to (\d+),(\d+)$/,
  async (x1s: string, y1s: string, x2s: string, y2s: string) => {
    const [x1, y1, x2, y2] = [x1s, y1s, x2s, y2s].map((s) => parseInt(s, 10));
    await I.usePlaywrightTo(
      "draw an arrow",
      async ({ page }: { page: Page; context: BrowserContext }) => {
        await page.mouse.move(x1, y1);
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.mouse.move(x2, y2, { steps: 15 });
        await page.waitForTimeout(200);
        await page.mouse.up();
      }
    );
  }
);

When(
  /^I draw a text from (\d*),(\d+) to (\d+),(\d+)$/,
  async (x1s: string, y1s: string, x2s: string, y2s: string) => {
    const [x1, y1, x2, y2] = [x1s, y1s, x2s, y2s].map((s) => parseInt(s, 10));
    await I.usePlaywrightTo(
      "draw an text",
      async ({ page }: { page: Page; context: BrowserContext }) => {
        await page.mouse.move(x1, y1);
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.mouse.move(x2, y2, { steps: 15 });
        await page.waitForTimeout(200);
        await page.mouse.up();
      }
    );
  }
);

When(/^I open the (\w+) settings menu$/, async (type: "text" | "arrow") => {
  I.waitForElement(`.annotations-${type}--dropdown .ant-dropdown-trigger`);
  I.click(`.annotations-${type}--dropdown .ant-dropdown-trigger`);
});

When(/^I select text at (\d+),(\d+)$/, async (x1s: string, y1s: string) => {
  const [x1, y1] = [x1s, y1s].map((s) => parseInt(s, 10));
  return await I.usePlaywrightTo(
    "select text",
    async ({ page }: { page: Page; context: BrowserContext }) => {
      await page.mouse.move(0, 0);
      await page.mouse.move(x1, y1, { steps: 15 });
      await page.mouse.down();
      await page.mouse.up();
    }
  );
});

When(
  /^I change the text at (\d+),(\d+) to "([^"]+)"$/,
  async (x1s: string, y1s: string, text: string) => {
    const [x1, y1] = [x1s, y1s].map((s) => parseInt(s, 10));
    await I.usePlaywrightTo(
      "change the text",
      async ({ page }: { page: Page; context: BrowserContext }) => {
        await page.mouse.move(x1, y1);
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.keyboard.type(text);
        await page.waitForTimeout(200);
        await page.mouse.up();
        await page.waitForTimeout(200);
        // unfocus the text
        await page.mouse.move(0, 0);
        await page.mouse.down();
        await page.mouse.up();
      }
    );
  }
);

When(/^I change the arrow direction to "(\w+)"$/, async (direction: string) => {
  I.waitForElement(".annotations-control--panel-arrow");
  const directionButton = `.annotations-control--panel-arrow .direction--${direction}`;
  I.waitForElement(directionButton);
  I.click(directionButton);
  return I.wait(0.25);
});

When(/^I change the arrow color to "(\w+)"$/, async (color: string) => {
  const panelClass = ".annotations-control--panel-arrow";
  I.waitForElement(panelClass);
  const selectorItem = ".arrow--color-picker";
  const colorButton = `${panelClass} ${selectorItem} .color-picker--item:nth-child(${color})`;
  I.waitForElement(colorButton);
  I.click(colorButton);
  return I.wait(0.25);
});

When(/^I change the arrow width to "(\w+)"$/, async (width: string) => {
  const panelClass = ".annotations-control--panel-arrow";
  I.waitForElement(panelClass);
  const selectorItem = ".line-width-select";
  const itemClass = ".line-width-select--item-container";
  const widthButton = `${panelClass} ${selectorItem} ${itemClass}:nth-child(${width})`;
  I.waitForElement(widthButton);
  I.click(widthButton);
  return I.wait(0.25);
});

When(/^I change the text background to "(\w+)"$/, async (color: string) => {
  const panelClass = ".annotations-control--panel-text";
  I.waitForElement(panelClass);
  const selectorItem = ".text--background-color-picker";
  const colorButton = `${panelClass} ${selectorItem} .color-picker--item:nth-child(${color})`;
  I.waitForElement(colorButton);
  I.click(colorButton);
  return I.wait(0.25);
});

When(/^I unselect the text$/, async () => {
  return await I.usePlaywrightTo(
    "unselect text",
    async ({ page }: { page: Page; context: BrowserContext }) => {
      await page.mouse.move(0, 0, { steps: 15 });
      await page.mouse.down();
      await page.mouse.up();
    }
  );
});

When(/^I change the text color to "([^"]+)"$/, async (color: string) => {
  const panelClass = ".annotations-control--panel-text";
  I.waitForElement(panelClass);
  const selectorItem = ".text--color-picker";
  const colorButton = `${panelClass} ${selectorItem} .color-picker--item:nth-child(${color})`;
  I.waitForElement(colorButton);
  I.click(colorButton);
  return I.wait(0.25);
});

When(/^I change the text font to "([^"]+)"$/, async (font: string) => {
  const panelClass = ".annotations-control--panel-text";
  I.waitForElement(panelClass);
  const selectorItem = ".text--font .ant-dropdown-trigger";
  const fontDropDownButton = `${panelClass} ${selectorItem}`;
  I.waitForElement(fontDropDownButton);
  I.click(fontDropDownButton);
  const fontItem = `.text--font-dropdown .ant-dropdown-menu-item:nth-child(${font})`;
  I.waitForElement(fontItem);
  I.click(fontItem);
  I.wait(0.25);
});

When(/^I change the text size to "([^"]+)"$/, async (size: string) => {
  const panelClass = ".annotations-control--panel-text";
  I.waitForElement(panelClass);
  const selectorItem = ".text--size .ant-dropdown-trigger";
  const sizeDropDownButton = `${panelClass} ${selectorItem}`;
  I.waitForElement(sizeDropDownButton);
  I.click(sizeDropDownButton);
  const sizeItem = `.text--size-dropdown .ant-dropdown-menu-item:nth-child(${size})`;
  I.waitForElement(sizeItem);
  I.click(sizeItem);
  I.wait(0.25);
});

When(
  /^I connect the arrow to the text around (\d+),(\d+)$/,
  async (x1s: string, y1s: string) => {
    const [x1, y1] = [x1s, y1s].map((s) => parseInt(s, 10));
    await I.usePlaywrightTo(
      "connect arrow to text",
      async ({ page }: { page: Page; context: BrowserContext }) => {
        await page.mouse.move(x1, y1);
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.mouse.move(x1 + 10, y1, { steps: 60 });
        await page.waitForTimeout(200);
        await page.mouse.up();
        await page.waitForTimeout(200);
      }
    );
  }
);

When(
  /^I drag the text at (\d+),(\d+) by (\d+)$/,
  async (x1s: string, y1s: string, shiftS: string) => {
    const [x1, y1, shift] = [x1s, y1s, shiftS].map((s) => parseInt(s, 10));
    await I.usePlaywrightTo(
      "drag text",
      async ({ page }: { page: Page; context: BrowserContext }) => {
        await page.mouse.move(x1 + 10, y1 - 2);
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.mouse.move(x1 + shift, y1, { steps: 60 });
        await page.waitForTimeout(200);
        await page.mouse.up();
      }
    );
  }
);

Then(
  /^The export "([^"]+)" contains an arrow from (\d*),(\d+) to (\d+),(\d+)$/,
  async (name: string, x1s: string, y1s: string, x2s: string, y2s: string) => {
    // read the file from screenshotFolder
    const { doc } = await readSvg(name);
    const arrows = doc.querySelectorAll("[data-annotation-type=arrow]");
    assert.equal(arrows.length, 1);
    const arrow = arrows[0];
    assert.equal(arrow.getAttribute("stroke"), colors[1]);
    assert.equal(
      arrow.getAttribute("stroke-width"),
      lineWidthItems[1].value.toString()
    );
    // not checking the path here, assuming it's tested in the drawing module
  }
);

Then(
  /^The export "([^"]+)" contains a text "([^"]+)" at (\d+),(\d+) to (\d+),(\d+)$/,
  async (name: string, text: string) => {
    const { doc } = await readSvg(name);
    const texts = doc.querySelectorAll("[data-annotation-type=text]");
    assert.equal(texts.length, 1);
    assert.equal(texts[0].textContent, text);
  }
);

Then(
  /^The export "([^"]+)" contains an arrow with direction "([^"]+)"$/,
  async (name: string, direction: string) => {
    const { doc } = await readSvg(name);
    const arrows = doc.querySelectorAll("[data-annotation-type=arrow]");
    assert.equal(arrows.length, 1);
    const arrow = arrows[0];
    const commands = arrow.getAttribute("d")?.split(" ");
    const expectedLength =
      direction === "both" ? 21 : direction === "none" ? 5 : 13;
    assert.equal(commands?.length, expectedLength);
  }
);

Then(
  /^The export "([^"]+)" contains an arrow with color "([^"]+)"$/,
  async (name: string, color: string) => {
    const { doc } = await readSvg(name);
    const arrows = doc.querySelectorAll("[data-annotation-type=arrow]");
    assert.equal(arrows.length, 1);
    const arrow = arrows[0];
    assert.equal(
      arrow.getAttribute("stroke")?.toUpperCase(),
      colors[+color - 1]
    );
  }
);

Then(
  /^The export "([^"]+)" contains an arrow with width "([^"]+)"$/,
  async (name: string, width: string) => {
    const { doc } = await readSvg(name);
    const arrows = doc.querySelectorAll("[data-annotation-type=arrow]");
    assert.equal(arrows.length, 1);
    const arrow = arrows[0];
    assert.equal(
      arrow.getAttribute("stroke-width"),
      lineWidthItems[+width - 1].value.toString()
    );
  }
);

Then(
  /^The export "([^"]+)" contains (\d+) arrows$/,
  async (name: string, num: string) => {
    const { doc } = await readSvg(name);
    const arrows = doc.querySelectorAll("[data-annotation-type=arrow]");
    assert.equal(arrows.length, +num);
  }
);

Then(
  /^The export "([^"]+)" contains a text "([^"]+)" with background "([^"]+)"$/,
  async (name: string, textContent: string, color: string) => {
    const { doc } = await readSvg(name);
    const texts = doc.querySelectorAll("[data-annotation-type=text]");
    assert.equal(texts.length, 1);
    const text = texts[0];
    const bg = text.querySelector("rect");
    assert.isNotNull(bg);
    if (+color === 1) assert.equal(bg?.getAttribute("fill"), "none");
    else
      assert.equal(bg?.getAttribute("fill")?.toUpperCase(), colors[+color - 2]);
  }
);

Then(
  /^The export "([^"]+)" contains a text "([^"]+)" with color "([^"]+)"$/,
  async (name: string, text: string, color: string) => {
    const { doc } = await readSvg(name);
    const texts = doc.querySelectorAll("[data-annotation-type=text]");
    assert.equal(texts.length, 1);
    assert.equal(texts[0].textContent, text);
    assert.equal(
      texts[0].getAttribute("fill")?.toUpperCase(),
      colors[+color - 1]
    );
  }
);

Then(
  /^The export "([^"]+)" contains a text "([^"]+)" with font "([^"]+)"$/,
  async (name: string, text: string, font: string) => {
    const { doc } = await readSvg(name);
    const texts = doc.querySelectorAll("[data-annotation-type=text]");
    assert.equal(texts.length, 1);
    assert.equal(texts[0].textContent, text);
    const fontIndex = +font - 1;
    assert.equal(
      texts[0].getAttribute("font-family"),
      fontFamilies[fontItems[fontIndex]!.key as keyof typeof fontFamilies]
    );
  }
);

Then(
  /^The export "([^"]+)" contains a text "([^"]+)" with size "([^"]+)"$/,
  async (name: string, text: string, size: string) => {
    const { doc } = await readSvg(name);
    const texts = doc.querySelectorAll("[data-annotation-type=text]");
    assert.equal(texts.length, 1);
    assert.equal(texts[0].textContent, text);
    const sizeIndex = +size - 1;
    assert.equal(
      texts[0].getAttribute("font-size"),
      fontSizeItems[sizeIndex]!.key
    );
  }
);

Then(
  /^The export "([^"]+)" contains a text "([^"]+)" connected to an arrow$/,
  async (name: string, text: string) => {
    const { doc } = await readSvg(name);
    const texts = doc.querySelectorAll("[data-annotation-type=text]");
    const arrows = doc.querySelectorAll("[data-annotation-type=arrow]");
    assert.equal(texts.length, 1);
    assert.equal(arrows.length, 1);
  }
);
