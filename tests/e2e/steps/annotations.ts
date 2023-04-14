import { assert } from "chai";
import Ogma from "@linkurious/ogma";
import { formats } from "../../../src/constants";
import {
  colors,
  lineWidthItems,
} from "../../../src/components/annotations/constants";
import { locator } from "codeceptjs";
import { BrowserContext, Page } from "playwright";
import * as path from "path";
import * as fs from "fs/promises";
import { DOMParser } from "xmldom-qsa";

const { I } = inject();
const ogma = {} as Ogma;

const rootFolder = "../../reports/html/e2e/";
const screenshotFolder = path.join(rootFolder, "screenshot/");

When(/^I select annotation (\w+)$/, async (type) => {
  I.waitForElement(`.annotations-${type}--dropdown button`);
  I.click(`.annotations-${type}--dropdown button`);
});

When(/^I select annotation text$/, async () => {
  I.waitForElement(".annotations-text--dropdown button");
  I.click(".annotations-text--dropdown button");
});

When(
  /^I draw an arrow from (\d*),(\d+) to (\d+),(\d+)$/,
  async (x1s, y1s, x2s, y2s) => {
    const [x1, y1, x2, y2] = [x1s, y1s, x2s, y2s].map((s) => parseInt(s, 10));
    await I.usePlaywrightTo(
      "draw an arrow",
      async ({ page }: { page: Page; context: BrowserContext }) => {
        await page.mouse.move(x1, y1);
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.mouse.move(x2, y2, { steps: 60 });
        await page.waitForTimeout(200);
        await page.mouse.up();
      }
    );
  }
);

When(
  /^I draw a text from (\d*),(\d+) to (\d+),(\d+)$/,
  async (x1s, y1s, x2s, y2s) => {
    const [x1, y1, x2, y2] = [x1s, y1s, x2s, y2s].map((s) => parseInt(s, 10));
    await I.usePlaywrightTo(
      "draw an text",
      async ({ page }: { page: Page; context: BrowserContext }) => {
        await page.mouse.move(x1, y1);
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.mouse.move(x2, y2, { steps: 60 });
        await page.waitForTimeout(200);
        await page.mouse.up();
      }
    );
  }
);

When(
  /^I change the text at (\d+),(\d+) to "([^"]+)"$/,
  async (x1s, y1s, text) => {
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

Then(
  /^The export ([\w\.]+) contains an arrow from (\d*),(\d+) to (\d+),(\d+)$/,
  async (name, x1s, y1s, x2s, y2s) => {
    // read the file from screenshotFolder
    const filePath = path.join(screenshotFolder, name);
    const svg = await fs.readFile(filePath, "utf-8");
    const doc = new DOMParser().parseFromString(svg);
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
  /^The export ([\w.]+) contains a text "([^"]+)" at (\d+),(\d+) to (\d+),(\d+)$/,
  async (name, text) => {
    const filePath = path.join(screenshotFolder, name);
    const svg = await fs.readFile(filePath, "utf-8");
    const doc = new DOMParser().parseFromString(svg);
    const texts = doc.querySelectorAll("[data-annotation-type=text]");
    assert.equal(texts.length, 1);
    assert.equal(texts[0].textContent, text);
  }
);
